import React from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import PolkaItem from './components/polkaItem';
import {mnemonicGenerate} from '@polkadot/util-crypto';

const DATA = [
  {
    id: '1',
    title: 'Generate Seed phrase',
    navigationFunction: 'navigateToSeed',
  },
  {
    id: '2',
    title: 'Chain info',
    navigationFunction: 'navigateToChainInfo',
  },
];

export default function HomeScreen({navigation}: any) {
  function renderItems(itemData: any) {
    const navigateTo = (item: any) => {
      console.log(item);
      switch (item) {
        case 'navigateToSeed':
          const mnemonic = mnemonicGenerate();
          navigation.navigate('Generate Seeds', {mnemonic});
          break;
        case 'navigateToChainInfo':
          navigation.navigate('Chain Info');
          break;
      }
    };

    return (
      <PolkaItem
        title={itemData.item.title}
        onPress={() => navigateTo(itemData.item.navigationFunction)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItems}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}

// <SafeAreaView style={styles.container}>
//   <View></View>
//   <PolkaItem title={"Generate Seed phrase"} onPress={navigateToSeed} />
//   <PolkaItem title={"Chain Info"} onPress={navigateToChainInfo} />
// </SafeAreaView>

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
  },
  button: {
    flex: 1,
  },
});
