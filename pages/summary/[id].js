import React, { useState, useEffect } from "react";
import Link from "next/link";

import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";

const GET_SUMMARY_ITEM = gql`
  query getHistoryItem($id: ID!) {
    historyItem(id: $id) {
      id
      name
      summary {
        whoPays
        whomPays
        howMany
      }
    }
  }
`;

const Summary = ({ id }) => {
  const { loading, data } = useQuery(GET_SUMMARY_ITEM, {
    variables: { id: id },
  });
  let displayedItems = 0;
  console.log(data?.historyItem?.payments);
  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mr-auto">Summary</span>
        <Link href="/">
          <a className="btn btn-dark mr-2">History</a>
        </Link>
        <Link href="/settlement/[id]" as={`/settlement/${id}`}>
          <a className="btn btn-dark">Settlement details</a>
        </Link>
      </nav>
      <div className="container">
        <div className="row pt-5 pb-5">
          {data && <h2>{data?.historyItem?.name}</h2>}
        </div>
        <div className="row">{loading && <p>Loading...</p>}</div>
        {data && (
          <div>
            <div className="row pb-2 font-weight-bold">
              <div className="col-4">Who gives back</div>
              <div className="col-4">To whom</div>
              <div className="col-4">How many</div>
            </div>
            {data?.historyItem?.summary?.map(
              ({ whoPays, whomPays, howMany }) => {
                if (howMany > 0) {
                  displayedItems += 1;
                  const backgroundClass = displayedItems % 2 ? "bg-light" : "";
                  return (
                    <div className={`row ${backgroundClass} p-2 rounded`}>
                      <div className="col-4">{whoPays}</div>
                      <div className="col-4">{whomPays}</div>
                      <div className="col-4">{howMany.toFixed(2)}</div>
                    </div>
                  );
                }
              }
            )}
            {displayedItems === 0 && (
              <div className="row">All are settled!</div>
            )}
          </div>
        )}
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
export default Summary;
