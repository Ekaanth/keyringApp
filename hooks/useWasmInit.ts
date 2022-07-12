import {ApiPromise, WsProvider} from '@polkadot/api';
import {cryptoWaitReady} from '@polkadot/util-crypto';
import {useEffect, useState} from 'react';

export default function useWasmInit() {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const wsProvider = new WsProvider('wss://rpc.polkadot.io');
      await ApiPromise.create({provider: wsProvider});
      cryptoWaitReady().then(() => {
        setLoading(true);
      });
    }
    fetchData();
  }, []);

  return isLoading;
}
