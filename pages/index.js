import { gql } from "apollo-boost";
import { useQuery } from "@apollo/client";
import HistoryItem from "../components/HistoryItem";
import Link from "next/link";

const HISTORY = gql`
  {
    history_elements {
    id
    name
    nick_names {
      name
    }
  }
  }
`;

const Home = () => {
  const { loading, error, data } = useQuery(HISTORY);
  return (
    <div>
      <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light">
        <span className="navbar-brand mb-0 h1 mr-auto">History</span>
        <Link href="/settlement">
          <a className="btn btn-dark">+</a>
        </Link>
      </nav>
      <div className="container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {JSON.stringify(error)}</p>}
        <div className="row">
          <div className="col-12">
            {data?.history_elements.map((item) => (
              <HistoryItem item={item} key={item.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
