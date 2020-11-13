import React, { useEffect } from "react";
import Link from "next/link";

import SettlementForm from "../../components/SettlementForm";
import calculate from "../../utils/calculateSettlement";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  updateSettlement,
  selectSingleSettlement,
  cleanSingleSettlement
} from "../../store/settlementSlice";
import Router from "next/router";
const UPDATE_HISTORY_ITEM = gql`
  mutation updateHistoryItem($id: ID!, $historyElement: HistoryElementInput) {
    updateHistoryItem(id: $id, historyElement: $historyElement) {
      id
      name
    }
  }
`;

const GET_HISTORY_ITEM = gql`
  query getHistoryItem($id: ID!) {
    historyItem(id: $id) {
      id
      name
      nickNames
      payments {
        whoPayed
        forWhom
        howMany
      }
    }
  }
`;

const ADD_HISTORY_ITEM = gql`
  mutation insertHistoryItem($historyElement: HistoryElementInput) {
    insertHistoryItem(historyElement: $historyElement) {
      id
      name
    }
  }
`;

const Settlement = (props) => {
  const [id] = props.id || [];
  const dispatch = useDispatch();
  const singleSettlement = useSelector(selectSingleSettlement);
  const { loading, data, error } = useQuery(GET_HISTORY_ITEM, {
    variables: { id: id },
  });

  useEffect(() => {
    if (!loading && !error) {
      const {
        historyItem: { name, nickNames, payments },
      } = data;
      dispatch(
        updateSettlement({
          value: { recordName: name, people: nickNames, expenses: payments },
        })
      );
    }
    return () => dispatch(cleanSingleSettlement())
  }, [loading, data, error]);

  const [updateHistoryItem, _] = useMutation(UPDATE_HISTORY_ITEM);
  const [addHistoryItem, __] = useMutation(ADD_HISTORY_ITEM);

  const calculateSettlement = ({ recordName, people, expenses }) => {
    const settlement = calculate(expenses);
    const historyElement = {
      name: recordName,
      nickNames: people,
      payments: expenses.map(({ whoPayed, forWhom, howMany }) => {
        return { whoPayed, forWhom, howMany };
      }),
      summary: settlement.map((payment) => {
        return {
          whoPays: payment.whoBorrowed,
          whomPays: payment.fromWhomBorrowed,
          howMany: payment.howMany,
        };
      }),
    };
    if (id) {
      updateHistoryItem({
        variables: { id: id, historyElement: historyElement },
      })
    } else {
      addHistoryItem({ variables: { historyElement: historyElement } }).then(
        (res) => {
          Router.push("/summary/[id]", `/summary/${res.data.insertHistoryItem.id}`);
        }
      );
    }
  }

  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mr-auto">Settlement details</span>
        <Link href="/">
          <a className="btn btn-dark mr-2">History</a>
        </Link>
        <Link href="/summary/[id]" as={`/summary/${id}`}>
          <button
            className="btn btn-dark"
            onClick={() => calculateSettlement(singleSettlement)}
          >
            Summary
          </button>
        </Link>
      </nav>
      <div className="container">
        <div className="row pt-5">
          {loading && <p>Loading...</p>}
          {singleSettlement && (
            <SettlementForm
              calculateSettlement={calculateSettlement}
              initialValues={singleSettlement}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps({ params: { id } }) {
  return {
    props: { id: id || null },
  };
}

export default Settlement;
