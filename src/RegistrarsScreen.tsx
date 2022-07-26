import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';

export default function RegistrarsScreen() {
  const api = useRpcConnect();

  const register = useMemo(() => {
    const registrars = JSON.stringify(api?.query.identity?.registrars);
    return registrars;
  }, [api]);

  console.log(register);

  return (
    <View>
      <Text>RegistrarsScreen</Text>
    </View>
  );
}
