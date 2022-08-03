import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';
import {formatBalance} from './service/chainServices';

type registrars = {
  account: string;
  fee: string;
  fields: Array<string>[];
};

export default function RegistrarsScreen() {
  const {apiLoaded: api} = useRpcConnect();
  const [registrars, setRegistrars] = useState<registrars[]>();
  useEffect(() => {
    if (api) {
      api?.query.identity?.registrars().then((reg) => {
        setRegistrars(
          reg
            .map((r) => r.unwrap())
            .map((r) => {
              return {
                account: r.account.toString(),
                fee: r.fee.toString(),
                formattedFee: formatBalance(api, r.fee.toString(), false),
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
        keyExtractor={(item) => item.account}
        renderItem={({item, index}) => (
          <View style={styles.registrarsContainer}>
            <Text>Registrars {index}</Text>
            <Text style={styles.address} numberOfLines={1}>
              Account : {item.account}
            </Text>
            <Text>Fee : {item.formattedFee}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.item}>There are no registrars</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.header}>Current Registrars</Text>
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
  },
  header: {
    textAlign: 'center',
    fontSize: 22,
  },
  registrarsContainer: {
    padding: 10,
  },
  address: {
    flex: 0,
    flexDirection: 'row',
  },
});
