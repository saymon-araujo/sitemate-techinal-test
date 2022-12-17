import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { screen } from "./constants/screen";

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "c95370184dmsh1394c27450427f3p1152bbjsna314f3f17ef6",
    "X-RapidAPI-Host": "lyrics-plus.p.rapidapi.com",
  },
};

interface LyricsDTO {
  artist: string;
  lyrics: string;
}

export function App() {
  const [lyricInfo, setLyricInfo] = useState<LyricsDTO | undefined>();
  const [isSongInputFocused, setIsSongInputFocused] = useState(false);
  const [isArtistFocused, setIsArtistFocused] = useState(false);

  const [isLoadinglyrics, setIsLoadinglyrics] = useState(false);

  const [songNameToSearch, setSongNameToSearch] = useState<string>("");
  const [artistNameToSearch, setArtistNameToSearch] = useState<string>("");

  const artistNameInputRef = useRef<TextInput>(null);

  function onSongInputIsFocused(isFocused: boolean) {
    setIsSongInputFocused(isFocused);
  }
  function onArtistInputIsFocused(isFocused: boolean) {
    setIsArtistFocused(isFocused);
  }

  function handleSearchForLyrics() {
    if (!songNameToSearch) {
      Alert.alert("Oops!", "You need to enter the song of the name");
      return;
    }
    if (!artistNameToSearch) {
      Alert.alert("Oops!", "You need to enter the name of the artist");
      return;
    }

    fetchLyrics();
  }

  function fetchLyrics() {
    setIsLoadinglyrics(true);
    fetch(
      `https://lyrics-plus.p.rapidapi.com/lyrics/${songNameToSearch.toLocaleLowerCase()}/${artistNameToSearch.toLocaleLowerCase()}`,
      options
    )
      .then((response) => response.json())
      .then((responseJson) => {
        setIsLoadinglyrics(false);

        if (!responseJson.body.lyrics) {
          Alert.alert("Oops", `We couldn't find any lyrics for this song`);
          return;
        } else {
          setLyricInfo(responseJson.body);
        }
      })
      .catch(() => {
        Alert.alert("Oops", `We couldn't find any lyrics for this song`);
        setIsLoadinglyrics(false);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar animated barStyle={"light-content"} translucent />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lyrics Finder</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.searchHeaderWrapper}>
          <View style={{ width: screen.width * 0.6 }}>
            <TextInput
              onChangeText={setSongNameToSearch}
              placeholder={"Song name"}
              returnKeyType={"next"}
              value={songNameToSearch}
              keyboardType="default"
              onFocus={() => {
                onSongInputIsFocused(true);
              }}
              onBlur={() => {
                onSongInputIsFocused(false);
              }}
              style={[styles.input, isSongInputFocused && { borderBottomColor: "#fe7f2d" }]}
              onSubmitEditing={() => {
                artistNameInputRef.current?.focus();
              }}
            />
            <View style={{ minHeight: 16 }} />
            <TextInput
              onChangeText={setArtistNameToSearch}
              ref={artistNameInputRef}
              returnKeyType={"search"}
              value={artistNameToSearch}
              placeholder={"Artist name"}
              keyboardType="default"
              onFocus={() => {
                onArtistInputIsFocused(true);
              }}
              onBlur={() => {
                onArtistInputIsFocused(false);
              }}
              style={[styles.input, isArtistFocused && { borderBottomColor: "#fe7f2d" }]}
              onSubmitEditing={handleSearchForLyrics}
            />
          </View>

          <TouchableOpacity
            style={styles.searchButton}
            disabled={isLoadinglyrics}
            onPress={handleSearchForLyrics}
          >
            {isLoadinglyrics ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.searchText}>Search</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.lyricsContainer} showsVerticalScrollIndicator={false}>
          {!lyricInfo?.lyrics ? (
            <>
              <Text style={styles.emptyLyricsPlaceholder}>
                After you search for the lyrics, they will appear here
              </Text>
            </>
          ) : (
            <Text style={styles.lyric}>{lyricInfo?.lyrics}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    backgroundColor: "#233d4d",
    width: "100%",
    height: screen.height * 0.15,
    padding: 16,
    paddingTop: screen.height * 0.05,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
  },
  body: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    paddingBottom: screen.height * 0.05,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccd7de",
    padding: 8,
  },
  searchHeaderWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  searchButton: {
    backgroundColor: "#fe7f2d",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    width: 80,
  },
  searchText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  lyricsContainer: {
    borderWidth: 1,
    marginVertical: 16,
    borderColor: "#ccd7de",
    padding: 8,
  },
  emptyLyricsPlaceholder: {
    color: "#9dbed2",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    textAlign: "center",
  },
  lyric: {
    color: "#233d4d",
    fontSize: 16,
    paddingBottom: 60,
    paddingTop: 8,
  },
});
