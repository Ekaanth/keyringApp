import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/HomeScreen';
import GenerateSeedScreen from './src/GenerateSeedScreen';
import useWasmInit from './hooks/useWasmInit';
import ChainInfoScreen from './src/ChainInfoScreen';

const Stack = createNativeStackNavigator()

export default function App() {
  const isWasmInit = useWasmInit();

  if (!isWasmInit) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
       <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Polkadot Keyring Samples" component={HomeScreen}/>
        <Stack.Screen name="Generate Seeds" component={GenerateSeedScreen}/>
        <Stack.Screen name="Chain Info" component={ChainInfoScreen}/>
      </Stack.Navigator>
      </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
