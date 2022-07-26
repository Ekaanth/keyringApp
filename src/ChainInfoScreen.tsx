import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';

export default function ChainInfoScreen() {
  const api = useRpcConnect();
  const [network, setNetwork] = useState('-');
  const [version, setVersion] = useState('-');
  useEffect(() => {
    if (api) {
      setNetwork(api?.runtimeChain.toString());
      setVersion(api?.runtimeVersion.transactionVersion.toString());
    }
  }, [api]);

  if (!network || !version) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Network Name: {network}</Text>
      <Text>Network Version: {version}</Text>
    </View>
  );
}
