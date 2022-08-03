import React, {useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Keyring} from '@polkadot/keyring';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {mnemonicGenerate} from '@polkadot/util-crypto';

export default function GeneratedSeedAddress() {
  const mnemonic = mnemonicGenerate();
  const [seed, setSeed] = useState(mnemonic);
  const [address, setAddress] = useState('');

  const getMnemonicAddress = React.useCallback(() => {
    const keyring = new Keyring({type: 'sr25519', ss58Format: 2});
    const pair = keyring.addFromUri(seed, {name: 'first pair'}, 'ed25519');
    setAddress(pair.address);
  }, [seed]);

  const getNewSeed = React.useCallback(() => {
    setSeed(mnemonicGenerate());
    setAddress('');
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.containerBody} />
        <View style={styles.seedContainer}>
          {seed ? (
            <>
              <Text>Seed</Text>
              <Text style={styles.seed}>{seed}</Text>
              <View style={styles.button}>
                <Button title="Get new seed" onPress={getNewSeed} />
              </View>
            </>
          ) : null}
        </View>
        <>
          <View style={styles.containerBody}>
            <Text>Address</Text>
            <Text style={styles.address}>{address}</Text>
            <View style={styles.button}>
              <Button title="Generate address from seed" onPress={getMnemonicAddress} />
            </View>
          </View>
        </>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerBody: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seedContainer: {
    margin: 10,
    shadowOpacity: 0.25,
    elevation: 5,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seed: {
    marginTop: 10,
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
