import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";
import { useMedia } from "../MediaContext";
import { injectedScript } from "../injectedScript";

export default function BrowserScreen({ route }) {
  const { accounts, addMedia } = useMedia();
  const webviewRef = useRef(null);
  const [urlText, setUrlText] = useState("https://x.com/home");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // ギャラリー画面から遷移してきた場合、指定URLを開く
  useEffect(() => {
    const target = route?.params?.url;
    if (target) {
      setUrlText(target);
      webviewRef.current?.injectJavaScript(
        `window.location.href = ${JSON.stringify(target)}; true;`
      );
    }
  }, [route?.params?.url]);

  const updateWatchedAccounts = useCallback(() => {
    const script = `window.__watchedAccounts = ${JSON.stringify(accounts)}; true;`;
    webviewRef.current?.injectJavaScript(script);
  }, [accounts]);

  useEffect(() => {
    updateWatchedAccounts();
  }, [accounts, updateWatchedAccounts]);

  const onMessage = useCallback(
    (event) => {
      try {
        const payload = JSON.parse(event.nativeEvent.data);
        if (payload.type === "media" && Array.isArray(payload.items)) {
          addMedia(payload.items);
        }
      } catch (e) {
        // ignore malformed messages
      }
    },
    [addMedia]
  );

  const navigateTo = () => {
    let target = urlText.trim();
    if (!/^https?:\/\//.test(target)) {
      target = "https://" + target;
    }
    webviewRef.current?.injectJavaScript(
      `window.location.href = ${JSON.stringify(target)}; true;`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          disabled={!canGoBack}
          onPress={() => webviewRef.current?.goBack()}
          style={styles.iconBtn}
        >
          <Text style={[styles.iconText, !canGoBack && styles.disabled]}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canGoForward}
          onPress={() => webviewRef.current?.goForward()}
          style={styles.iconBtn}
        >
          <Text style={[styles.iconText, !canGoForward && styles.disabled]}>›</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.urlInput}
          value={urlText}
          onChangeText={setUrlText}
          onSubmitEditing={navigateTo}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
        />
        <TouchableOpacity onPress={() => webviewRef.current?.reload()} style={styles.iconBtn}>
          <Text style={styles.iconText}>⟳</Text>
        </TouchableOpacity>
      </View>

      <WebView
        ref={webviewRef}
        source={{ uri: urlText }}
        injectedJavaScript={injectedScript}
        onMessage={onMessage}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
          setCanGoForward(navState.canGoForward);
          setUrlText(navState.url);
        }}
        onLoadEnd={updateWatchedAccounts}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        startInLoadingState
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f1419" },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: "#0f1419",
    borderBottomWidth: 1,
    borderBottomColor: "#262a2e",
  },
  iconBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  iconText: { color: "#1d9bf0", fontSize: 22 },
  disabled: { color: "#444" },
  urlInput: {
    flex: 1,
    backgroundColor: "#16181c",
    color: "#fff",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#262a2e",
  },
});
