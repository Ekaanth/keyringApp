import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {useCouncil} from './hooks/useCouncil';

export default function CouncilScreen() {
  const {proposals, loading} = useCouncil();

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
        data={proposals}
        keyExtractor={item => item.proposal.index}
        renderItem={({item}) => (
          <View style={styles.councilContainer}>
            <View style={styles.row}>
              <Text style={styles.bold}>Index: </Text>
              <Text>{item.proposal.index}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Votes: </Text>
              <Text>
                {item.votes.length}/{item.votes.threshold}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Index: </Text>
              <Text>{item.proposal.index}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Method: </Text>
              <Text>{item.proposal.method}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Status: </Text>
              <Text>{item.votingStatus.status}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.bold}>Bond: </Text>
              <Text>{item.proposal.bond}</Text>
            </View>
            <View>
              <Text style={styles.reason}>Meta</Text>
              <Text>{item.proposal.meta}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.item}>There are no active Proposals</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.header}>Active Proposals</Text>
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
  councilContainer: {
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
