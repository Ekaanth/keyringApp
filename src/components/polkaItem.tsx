import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

export default function PolkaItem({title, onPress}: {title: string; onPress: () => void}) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
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
