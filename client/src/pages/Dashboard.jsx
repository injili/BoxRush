import { Link } from "react-router-dom";
import useWebsocket from "../utilities/useWebsocket";

export default function Dashboard() {
  const shipments = useWebsocket("ws://localhost:5050?source=dashboard");
  const financials = useWebsocket("ws://localhost:5050?source=financials");

  return (
    <div>
      <Link to="/driver">Driver</Link>
      <h1>Real-Time shipments from JSON File</h1>
      {shipments ? (
        <pre>{JSON.stringify(shipments, null, 2)}</pre>
      ) : (
        <p>Waiting for shipments...</p>
      )}

      {financials ? (
        <pre>{JSON.stringify(financials, null, 2)}</pre>
      ) : (
        <p>Waiting for the financials...</p>
      )}
    </div>
  );
}
