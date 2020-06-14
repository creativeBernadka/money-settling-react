import React, { useState, useEffect } from "react";
import Link from "next/link";

import SettlementForm from "../../components/SettlementForm";
import calculate from "../../utils/calculateSettlement";
import { gql } from "apollo-boost";
import { useMutation, useQuery } from "@apollo/client";

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

const Settlement = ({ id }) => {
  const [people, setPeople] = useState([]);
  const [recordName, setRecordName] = useState("");
  const [expenses, setExpenses] = useState([]);

  const { loading, data } = useQuery(GET_HISTORY_ITEM, {
    variables: { id: id },
  });

  useEffect(() => {
    if (people.length === 0 && data) {
      const { name, nickNames, payments } = data.historyItem;
      setPeople(nickNames);
      setRecordName(name);
      setExpenses(payments);
    }
  });

  const [updateHistoryItem, _] = useMutation(UPDATE_HISTORY_ITEM);

  const calculateSettlement = () => {
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
    updateHistoryItem({
      variables: { id: id, historyElement: historyElement },
    });
  };

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
            onClick={() => calculateSettlement()}
          >
            Summary
          </button>
        </Link>
      </nav>
      <div className="container">
        <div className="row pt-5">
          {loading && <p>Loading...</p>}
          {data && (
            <SettlementForm
              people={people}
              setPeople={setPeople}
              recordName={recordName}
              setRecordName={setRecordName}
              expenses={expenses}
              setExpenses={setExpenses}
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
