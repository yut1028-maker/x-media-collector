import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  ScrollView,
} from "react-native";
import { useMedia } from "../MediaContext";

const NUM_COLUMNS = 2;

export default function GalleryScreen({ navigation }) {
  const { mediaItems } = useMedia();
  const [accountFilter, setAccountFilter] = useState("すべて");
  const [typeFilter, setTypeFilter] = useState("すべて");
  const [pickerOpen, setPickerOpen] = useState(null); // "account" | "type" | null

  const accounts = useMemo(
    () => ["すべて", ...Array.from(new Set(mediaItems.map((m) => m.account))).sort()],
    [mediaItems]
  );

  const filtered = useMemo(
    () =>
      mediaItems.filter((m) => {
        if (accountFilter !== "すべて" && m.account !== accountFilter) return false;
        if (typeFilter === "画像" && m.type !== "image") return false;
        if (typeFilter === "動画" && m.type !== "video") return false;
        return true;
      }),
    [mediaItems, accountFilter, typeFilter]
  );

  const openTweet = (url) => {
    navigation.navigate("ブラウザ", { url });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setPickerOpen("account")}>
          <Text style={styles.filterText}>
            {accountFilter === "すべて" ? "全アカウント" : "@" + accountFilter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setPickerOpen("type")}>
          <Text style={styles.filterText}>{typeFilter === "すべて" ? "全種類" : typeFilter}</Text>
        </TouchableOpacity>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            まだメディアが保存されていません。{"\n"}
            「ブラウザ」タブで登録アカウントの投稿を閲覧してください。
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ padding: 6 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.cell} onPress={() => openTweet(item.tweetUrl)}>
              <Image source={{ uri: item.mediaUrl }} style={styles.image} />
              {item.type === "video" && <Text style={styles.playIcon}>▶</Text>}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>@{item.account}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      <Modal visible={pickerOpen !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <ScrollView>
              {(pickerOpen === "account" ? accounts : ["すべて", "画像", "動画"]).map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={styles.modalOption}
                  onPress={() => {
                    if (pickerOpen === "account") setAccountFilter(opt);
                    else setTypeFilter(opt);
                    setPickerOpen(null);
                  }}
                >
                  <Text style={styles.modalOptionText}>
                    {pickerOpen === "account" && opt !== "すべて" ? "@" + opt : opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalClose} onPress={() => setPickerOpen(null)}>
              <Text style={styles.modalCloseText}>閉じる</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419" },
  filterBar: { flexDirection: "row", padding: 8, gap: 8 },
  filterBtn: {
    backgroundColor: "#16181c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#262a2e",
  },
  filterText: { color: "#e7e9ea", fontSize: 13 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  emptyText: { color: "#71767b", textAlign: "center", lineHeight: 20 },
  cell: {
    flex: 1 / NUM_COLUMNS,
    margin: 4,
    aspectRatio: 1,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#16181c",
  },
  image: { width: "100%", height: "100%" },
  playIcon: {
    position: "absolute",
    top: "42%",
    left: "45%",
    color: "#fff",
    fontSize: 22,
  },
  badge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: { color: "#fff", fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#16181c",
    maxHeight: "60%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
  },
  modalOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#262a2e" },
  modalOptionText: { color: "#e7e9ea", fontSize: 15 },
  modalClose: { paddingVertical: 12, alignItems: "center" },
  modalCloseText: { color: "#1d9bf0", fontSize: 15, fontWeight: "600" },
});
