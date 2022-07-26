import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';

type registrars = {
  account: string;
  fee: string;
  fields: Array<string>[];
};

export default function RegistrarsScreen() {
  const api = useRpcConnect();
  const [registrars, setRegistrars] = useState<registrars[]>();
  useEffect(() => {
    if (api) {
      api?.query.identity?.registrars().then(reg => {
        setRegistrars(
          reg
            .map(r => r.unwrap())
            .map((r: {account: {toString: () => any}}) => {
              return {
                account: r.account.toString(),
              };
            }),
        );
      });
    }
  }, [api]);

  if (!registrars) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={registrars}
        keyExtractor={item => item.account}
        renderItem={({item}) => (
          <View>
            <Text>{item.account}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.item}>There are no registrars</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    color: 'black',
  },
});
