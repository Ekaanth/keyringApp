import * as React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import GenerateSeedScreen from './src/GeneratedSeedAddress';
import useRpcConnect from './src/hooks/useRpcConnect';
import ChainInfoScreen from './src/ChainInfoScreen';
import RegistrarsScreen from './src/RegistrarsScreen';
import TipsScreen from './src/TipsScreen';
import CouncilScreen from './src/CouncilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const isWasmInit = useRpcConnect();

  if (!isWasmInit) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Polkadot Keyring Samples"
              component={HomeScreen}
            />
            <Stack.Screen
              name="Generate Seeds"
              component={GenerateSeedScreen}
            />
            <Stack.Screen name="Chain Info" component={ChainInfoScreen} />
            <Stack.Screen name="Tips" component={TipsScreen} />
            <Stack.Screen name="Council" component={CouncilScreen} />
            <Stack.Screen name="Registrars" component={RegistrarsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
