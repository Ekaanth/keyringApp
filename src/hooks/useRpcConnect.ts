import { ApiPromise, WsProvider } from "@polkadot/api";
import { useEffect, useState } from "react";

export default function useRpcConnect() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const wsProvider = new WsProvider("wss://rpc.polkadot.io");
      await ApiPromise.create({ provider: wsProvider });
      setLoading(true);
    }
    fetchData();
  }, []);

  return isLoading;
}
