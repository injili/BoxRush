import useWebsocket from "./utilities/useWebsocket";

export default function App() {
  const data = useWebsocket("ws://localhost:5050");

  return (
    <div>
      <h1>Real-Time Data from JSON File</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Waiting for data...</p>
      )}
    </div>
  );
}
