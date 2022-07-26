import React, {useMemo} from 'react';
import {Text, View} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';

export default function TipsScreen() {
  const api = useRpcConnect();

  const tip = useMemo(async () => {
    const tips = JSON.stringify(api?.query.tips.tips);
    return tips;
  }, [api]);

  console.log(tip);

  return (
    <View>
      <Text>TipsScreen</Text>
    </View>
  );
}
