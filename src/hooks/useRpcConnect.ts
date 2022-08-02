import {ApiPromise, WsProvider} from '@polkadot/api';
import {useEffect, useState} from 'react';

export default function useRpcConnect() {
  const [apiLoaded, setApiLoaded] = useState<ApiPromise>();
  const [connection, setConnection] = useState(false);
  useEffect(() => {
    async function fetchData() {
      const wsProvider = new WsProvider('wss://rpc.polkadot.io', false);
      const api = new ApiPromise({provider: wsProvider});
      await api.connect();
      api.on('ready', () => {
        setApiLoaded(api);
        setConnection(true);
      });
      api.on('disconnected', () => {
        const error = 'API got disconnected';
        console.log(error);
        setConnection(false);
      });

      api.on('error', (error) => {
        console.log(error);
      });
    }
    fetchData();
  }, []);

  return {apiLoaded, connection};
}
