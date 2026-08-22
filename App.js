import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { MediaProvider } from "./src/MediaContext";
import BrowserScreen from "./src/screens/BrowserScreen";
import GalleryScreen from "./src/screens/GalleryScreen";
import AccountsScreen from "./src/screens/AccountsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <MediaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: "#0f1419", borderTopColor: "#262a2e" },
            tabBarActiveTintColor: "#1d9bf0",
            tabBarInactiveTintColor: "#71767b",
          }}
        >
          <Tab.Screen name="ブラウザ" component={BrowserScreen} />
          <Tab.Screen name="ギャラリー" component={GalleryScreen} />
          <Tab.Screen name="アカウント" component={AccountsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MediaProvider>
  );
}
