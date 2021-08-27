import React from "react";
import Link from "next/link";
import Router from "next/router";
import { useFormik } from "formik";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/client";

import SettlementForm from "../../components/SettlementForm";
import calculate from "../../utils/calculateSettlement";

const ADD_HISTORY_ITEM = gql`
  mutation insertHistoryItem($object: history_elements_insert_input!) {
    insert_history_elements_one(object: $object) {
      id
      name
    }
  }
`;

export const emptyPayment = {
  how_many: 0,
  who_payed: { name: "" },
  for_whom: [{ single_user: { name: "" } }],
};

const NewSettlement = () => {
  const [addHistoryItem] = useMutation(ADD_HISTORY_ITEM);

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
          how_many,
          who_payed: { data: who_payed },
          for_whom: {
            data: for_whom.map(({ single_user }) => ({
              single_user: { data: single_user },
            })),
          },
        })
      );
      const fullSettlements = settlement.map((payment) => {
        return {
          who_pays: { data: { name: payment.whoBorrowed.single_user.name } },
          whom_pays: { data: { name: payment.fromWhomBorrowed.name } },
          how_many: payment.howMany,
        };
      });
      const historyElement = {
        name: values.name,
        nick_names: { data: values.nick_names },
        payments: { data: fullPayments },
        settlements: {
          data: fullSettlements,
        },
      };
      addHistoryItem({ variables: { object: historyElement } }).then((res) => {
        Router.push(
          "/summary/[id]",
          `/summary/${res.data.insert_history_elements_one.id}`
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
        <button className="btn btn-dark" onClick={handleSubmit} type="submit">
          Summary
        </button>
      </nav>
      <div className="container">
        <div className="row pt-5">
          <SettlementForm
            values={values}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            nickNames={values.nick_names}
            payments={values.payments}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSettlement;
