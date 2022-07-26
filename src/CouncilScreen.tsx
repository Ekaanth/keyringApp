import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';

export default function CouncilScreen() {
  const api = useRpcConnect();

  const council = useMemo(async () => {
    const councils = JSON.stringify(api?.query.tips.tips);
    return councils;
  }, [api]);

  console.log(council);

  return (
    <View>
      <Text>CouncilScreen</Text>
    </View>
  );
}
