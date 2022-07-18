import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/HomeScreen";
import useRpcConnect from "./src/hooks/useRpcConnect";
import ChainInfoScreen from "./src/ChainInfoScreen";
import GeneratedSeedAddress from "./src/GeneratedSeedAddress";

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
              name="Generated seed address"
              component={GeneratedSeedAddress}
            />
            <Stack.Screen name="Chain Info" component={ChainInfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }
}
