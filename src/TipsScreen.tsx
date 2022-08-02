import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import useRpcConnect from './hooks/useRpcConnect';
import useTips from './hooks/useTips';
import {formatBalance} from './service/chainServices';

export default function TipsScreen() {
  const {apiLoaded: api} = useRpcConnect();
  const {tips, loading} = useTips();

  if (loading) {
    return (
      <View>
        <Text style={styles.item}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={styles.tipsContainer}>
            <View style={styles.row}>
              <Text style={styles.bold}>Proposed By: </Text>
              <Text>{item.finder.address}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Deposit: </Text>
              <Text>{formatBalance(api, item.deposit.toString())}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Number of Tippers: </Text>
              <Text>{item.tippers.length}</Text>
            </View>
            <View>
              <Text style={styles.reason}>Reason</Text>
              <Text>{item.reason}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.item}>There are no active tips</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.header}>Tips</Text>
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
  tipsContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    margin: 10,
  },
  row: {
    flex: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  reason: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
});
