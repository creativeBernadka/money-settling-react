import React, { useEffect } from "react";
import Link from "next/link";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import Router from "next/router";

import SettlementForm from "../../components/SettlementForm";
import calculate from "../../utils/calculateSettlement";
import { emptyPayment } from "../settlement";

const UPDATE_HISTORY_ITEM = gql`
  mutation updateHistoryItem(
    $id: Int!
    $historyElement: history_elements_set_input
    $nickNames: [users_insert_input!]!
    $payments: [payments_insert_input!]!
    $settlements: [settlements_insert_input!]!
  ) {
    delete_users(where: { history_element_id: { _eq: $id } }) {
      affected_rows
    }
    delete_payments(where: { history_element_id: { _eq: $id } }) {
      affected_rows
    }
    delete_settlements(where: { history_element_id: { _eq: $id } }) {
      affected_rows
    }
    insert_users(objects: $nickNames) {
      affected_rows
    }
    insert_payments(objects: $payments) {
      affected_rows
    }
    insert_settlements(objects: $settlements) {
      affected_rows
    }
    update_history_elements_by_pk(
      pk_columns: { id: $id }
      _set: $historyElement
    ) {
      id
      name
    }
  }
`;

const GET_HISTORY_ITEM = gql`
  query getHistoryItem($id: Int!) {
    history_elements_by_pk(id: $id) {
      id
      name
      nick_names {
        name
      }
      payments {
        how_many
        who_payed {
          name
        }
        for_whom {
          single_user {
            name
          }
        }
      }
    }
  }
`;

const Settlement = ({ id }) => {
  const { loading, data } = useQuery(GET_HISTORY_ITEM, {
    variables: { id: id },
  });

  useEffect(() => {
    if (data && values.name === "") {
      const { name, nick_names, payments } = data.history_elements_by_pk;
      setFieldValue("nick_names", nick_names);
      setFieldValue("name", name);
      setFieldValue("payments", payments);
    }
  });

  const [updateHistoryItem] = useMutation(UPDATE_HISTORY_ITEM);

  const { values, handleChange, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      name: "",
      nick_names: [{ name: "" }],
      payments: [emptyPayment],
    },
    onSubmit: (values) => {
      const settlement = calculate(values.payments);
      const fullPayments = values.payments.map(
        ({ who_payed, for_whom, how_many }) => ({
          history_element_id: id,
          how_many,
          who_payed: { data: { name: who_payed?.name } },
          for_whom: {
            data: for_whom.map(({ single_user }) => ({
              single_user: { data: { name: single_user?.name } },
            })),
          },
        })
      );
      const fullSettlements = settlement.map((payment) => {
        return {
          who_pays: { data: { name: payment.whoBorrowed.single_user.name } },
          whom_pays: { data: { name: payment.fromWhomBorrowed.name } },
          how_many: payment.howMany,
          history_element_id: id,
        };
      });
      const historyElement = {
        name: values.name,
      };
      const fullNickNames = values.nick_names?.map((nickName) => ({
        history_element_id: id,
        name: nickName.name,
      }));
      updateHistoryItem({
        variables: {
          id: id,
          historyElement: historyElement,
          nickNames: fullNickNames,
          payments: fullPayments,
          settlements: fullSettlements,
        },
      }).then((res) => {
        Router.push(
          "/summary/[id]",
          `/summary/${res.data.update_history_elements_by_pk.id}`
        );
      });
    },
  });

  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mr-auto">Settlement details</span>
        <Link href="/">
          <a className="btn btn-dark mr-2">History</a>
        </Link>
        <Link href="/summary/[id]" as={`/summary/${id}`}>
          <button className="btn btn-dark" onClick={handleSubmit}>
            Summary
          </button>
        </Link>
      </nav>
      <div className="container">
        <div className="row pt-5">
          {loading && <p>Loading...</p>}
          {data && (
            <SettlementForm
              values={values}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              nickNames={values.nick_names}
              payments={values.payments}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: {
      id,
    },
  };
}

export default Settlement;
