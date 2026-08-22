import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useMedia } from "../MediaContext";

export default function AccountsScreen() {
  const { accounts, addAccount, removeAccount } = useMedia();
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!input.trim()) return;
    addAccount(input);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>収集アカウント</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="@ユーザー名"
          placeholderTextColor="#71767b"
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>追加</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>@{item}</Text>
            <TouchableOpacity onPress={() => removeAccount(item)}>
              <Text style={styles.removeText}>削除</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>まだアカウントが登録されていません</Text>
        }
      />

      <Text style={styles.helpText}>
        登録したアカウントの投稿を「ブラウザ」タブで閲覧すると、自動的にメディアが収集されます。
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419", padding: 16 },
  title: { color: "#e7e9ea", fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: { flexDirection: "row", gap: 8, marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: "#16181c",
    color: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#262a2e",
  },
  addBtn: {
    backgroundColor: "#1d9bf0",
    borderRadius: 6,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "600" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#262a2e",
  },
  listText: { color: "#e7e9ea", fontSize: 14 },
  removeText: { color: "#f4212e", fontSize: 13 },
  emptyText: { color: "#71767b", textAlign: "center", marginTop: 24 },
  helpText: { color: "#71767b", fontSize: 12, marginTop: 16, lineHeight: 18 },
});
