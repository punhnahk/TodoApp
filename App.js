import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import DetailScreen from "./screens/DetailScreen";
import EntryScreen from "./screens/EntryScreen";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

async function initializeDatabase(db) {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT
      );
    `);
    console.log("Database initialized");
  } catch (error) {
    console.log("Error while initializing database: ", error);
  }
}

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="text-search"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SQLiteProvider databaseName="todos.db" onInit={initializeDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomeTabs">
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          {/* Embed the tab navigator in the stack */}
          <Stack.Screen
            name="HomeTabs"
            component={HomeTabs}
            options={{ headerShown: false }} // Hide header for tabs
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
};

export default App;
