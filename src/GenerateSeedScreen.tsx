import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Keyring} from '@polkadot/keyring';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function GenerateSeedScreen({route}: any) {
  const {mnemonic} = route.params;
  const keyring = new Keyring({type: 'sr25519', ss58Format: 2});
  const [address, setAddress] = useState('');
  const getMnemonicAddress = () => {
    const pair = keyring.addFromUri(mnemonic, {name: 'first pair'}, 'ed25519');
    setAddress(pair.address);
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.containerBody}></View>
        <View style={styles.seedContainer}>
          {mnemonic ? (
            <>
              <Text style={styles.seed}> {mnemonic} </Text>
              <View style={styles.button}>
                <Button title="Mnemonic Address" onPress={getMnemonicAddress} />
              </View>
            </>
          ) : null}
        </View>
        {address ? (
          <>
            <View style={styles.containerBody}>
              <Text>Address</Text>
              <Text style={styles.address}>{address}</Text>
            </View>
          </>
        ) : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBody: {
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedContainer: {
    shadowOpacity: 0.25,
    elevation: 5,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seed: {
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
  },

  address: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    paddingTop: 10,
  },
});
