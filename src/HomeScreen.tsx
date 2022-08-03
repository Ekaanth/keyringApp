import React from 'react';
import {FlatList, SafeAreaView, StyleSheet} from 'react-native';
import PolkaItem from './components/polkaItem';

const DATA = [
  {
    id: '1',
    title: 'Generate Seed phrase',
    screen: 'Generate Seeds',
  },
  {
    id: '2',
    title: 'Chain info',
    screen: 'Chain Info',
  },
  {
    id: '3',
    title: 'Tips',
    screen: 'Tips',
  },
  {
    id: '4',
    title: 'Council',
    screen: 'Council',
  },
  {
    id: '5',
    title: 'Registrars',
    screen: 'Registrars',
  },
];

export default function HomeScreen({navigation}: any) {
  function renderItems(itemData: any) {
    const onNavigation = () => {
      navigation.navigate(itemData.item.screen);
    };
    return <PolkaItem title={itemData.item.title} onPress={onNavigation} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={DATA} renderItem={renderItems} keyExtractor={(item) => item.id} />
    </SafeAreaView>
  );
}

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
