import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

export default function useRpcConnect() {
  const [apiLoaded, setApiLoaded] = useState<ApiPromise>();

  useEffect(() => {
    async function fetchData() {
      const wsProvider = new WsProvider("wss://rpc.polkadot.io", false);
      const api = new ApiPromise({ provider: wsProvider });
      await api.connect();
      api.on("ready", () => {
        setApiLoaded(api);
      });
      api.on("disconnected", () => {
        const error = "API got disconnected";
        console.log(error);
      });

      api.on("error", (error) => {
        console.log(error);
      });
    }
    fetchData();
  }, []);

  return apiLoaded;
}
