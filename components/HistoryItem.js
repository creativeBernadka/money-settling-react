import Link from "next/link";

const HistoryItem = ({ item }) => {
  return (
    <div className="card m-5 p-3">
      <h5 className="card-title">{item.name}</h5>
      <h6 className="card-subtitle mb-2 text-muted">Participants:</h6>
      <div className="card-text">
        <div className="d-flex flex-row">
          {item.nick_names.map(({ name }) => (
            <p className="mr-3">{name}</p>
          ))}
        </div>
        <div className="d-flex flex-row">
          <Link href="/settlement/[id]" as={`/settlement/${item.id}`}>
            <a className="btn btn-dark mr-3">Edit</a>
          </Link>
          <Link href="/summary/[id]" as={`summary/${item.id}`}>
            <a className="btn btn-dark">Summary</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
