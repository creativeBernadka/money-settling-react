import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";

import SettlementForm from "../../components/SettlementForm";
import calculate from "../../utils/calculateSettlement";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/client";

const ADD_HISTORY_ITEM = gql`
  mutation insertHistoryItem($historyElement: HistoryElementInput) {
    insertHistoryItem(historyElement: $historyElement) {
      id
      name
    }
  }
`;

const NewSettlement = () => {
  const [people, setPeople] = useState([]);
  const [recordName, setRecordName] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [addHistoryItem, { data }] = useMutation(ADD_HISTORY_ITEM);

  const calculateSettlement = () => {
    const settlement = calculate(expenses);
    const historyElement = {
      name: recordName,
      nickNames: people,
      payments: expenses,
      summary: settlement.map((payment) => {
        return {
          whoPays: payment.whoBorrowed,
          whomPays: payment.fromWhomBorrowed,
          howMany: payment.howMany,
        };
      }),
    };
    addHistoryItem({ variables: { historyElement: historyElement } }).then(
      (res) => {
        Router.push("/summary/[id]", `/summary/${res.data.insertHistoryItem.id}`);
      }
    );
  };
  console.log(data);

  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mr-auto">Settlement details</span>
        <Link href="/">
          <a className="btn btn-dark mr-2">History</a>
        </Link>
        <button className="btn btn-dark" onClick={() => calculateSettlement()}>
          Summary
        </button>
      </nav>
      <div className="container">
        <div className="row pt-5">
          <SettlementForm
            people={people}
            setPeople={setPeople}
            recordName={recordName}
            setRecordName={setRecordName}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        </div>
      </div>
    </div>
  );
};

export default NewSettlement;
