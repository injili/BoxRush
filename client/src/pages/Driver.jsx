import { Link } from "react-router-dom";
import useWebsocket from "../utilities/useWebsocket";

export default function Driver() {
  const data = useWebsocket("ws://localhost:5050?source=driver");

  return (
    <div>
      <Link to="/">Home</Link>
      <h1>Real-Time Data from JSON File</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
