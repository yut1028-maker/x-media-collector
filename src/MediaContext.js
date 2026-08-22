import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCOUNTS_KEY = "watchedAccounts";
const MEDIA_KEY = "collectedMedia";

const MediaContext = createContext(null);

export function MediaProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [accRaw, mediaRaw] = await Promise.all([
          AsyncStorage.getItem(ACCOUNTS_KEY),
          AsyncStorage.getItem(MEDIA_KEY),
        ]);
        setAccounts(accRaw ? JSON.parse(accRaw) : []);
        setMediaItems(mediaRaw ? JSON.parse(mediaRaw) : []);
      } catch (e) {
        console.warn("Failed to load storage", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persistAccounts = useCallback(async (next) => {
    setAccounts(next);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(next));
  }, []);

  const persistMedia = useCallback(async (next) => {
    setMediaItems(next);
    await AsyncStorage.setItem(MEDIA_KEY, JSON.stringify(next));
  }, []);

  const addAccount = useCallback(
    (raw) => {
      const handle = raw.trim().replace(/^@/, "").toLowerCase();
      if (!handle) return;
      if (accounts.includes(handle)) return;
      persistAccounts([...accounts, handle]);
    },
    [accounts, persistAccounts]
  );

  const removeAccount = useCallback(
    (handle) => {
      persistAccounts(accounts.filter((a) => a !== handle));
    },
    [accounts, persistAccounts]
  );

  const addMedia = useCallback(
    (items) => {
      if (!items || items.length === 0) return;
      const existingIds = new Set(mediaItems.map((m) => m.id));
      const newOnes = items.filter((m) => !existingIds.has(m.id));
      if (newOnes.length === 0) return;
      const merged = [...newOnes, ...mediaItems].sort(
        (a, b) => b.capturedAt - a.capturedAt
      );
      persistMedia(merged);
    },
    [mediaItems, persistMedia]
  );

  const clearMedia = useCallback(() => {
    persistMedia([]);
  }, [persistMedia]);

  return (
    <MediaContext.Provider
      value={{
        loaded,
        accounts,
        mediaItems,
        addAccount,
        removeAccount,
        addMedia,
        clearMedia,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error("useMedia must be used within MediaProvider");
  return ctx;
}
