import { useIsFocused } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isFocused = useIsFocused();
  const db = useSQLiteContext();

  const searchTodos = async (searchTerm) => {
    try {
      const statement = await db.prepareAsync(
        `SELECT * FROM todos WHERE title LIKE '%' || ? || '%' OR description LIKE '%' || ? || '%';`
      );

      const results = await statement.executeAsync([searchTerm, searchTerm]);

      const allRows = await results.getAllAsync();

      console.log(allRows);
      setSearchResults(allRows);
    } catch (error) {
      console.log("Error executing search query: ", error);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim().length == 0) {
      Alert.alert("Search Term is required");
      return;
    }
    await searchTodos(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  useEffect(() => {
    if (isFocused) {
      searchTodos("");
    }
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.resultItem}>
      <Text>{`${item.title} | ${item.description}`}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search by task name"
        value={searchTerm}
        onChangeText={(newText) => setSearchTerm(newText)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleClear}>
        <Text style={styles.buttonText}>Clear All</Text>
      </TouchableOpacity>

      <Text style={styles.resultsHeader}>Results</Text>
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>No results found</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#f7f7f7",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 4,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  resultsHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  resultItem: {
    padding: 10,
    backgroundColor: "#ddd",
    marginVertical: 5,
    borderRadius: 4,
  },
});

export default SearchScreen;
