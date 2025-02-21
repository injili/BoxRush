import { useEffect, useState } from "react";

const useWebsocket = (url) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onopen = () => console.log;
    socket.onmessage = (event) => setData(JSON.parse(event.data));
    socket.onclose = () => console.log("WebSocket disconnected");
    socket.onerror = (error) => console.error("WebSocket error:", error);

    return () => socket.close();
  }, [url]);

  return data;
};

export default useWebsocket;
