import { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text } from "react-native";
import {
  getCurrentPositionAsync,
  LocationObjectCoords,
  requestForegroundPermissionsAsync,
} from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { ActiveOrderMapScreenProps } from "../types";
import { Map } from "../../components/Map";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ActiveOrderMap = ({ route }: ActiveOrderMapScreenProps) => {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<
    boolean | null
  >(null);
  const webviewRef = useRef<WebView>(null);
  const { mapCoords } = route.params;

  const getLocation = async () => {
    const response = await requestForegroundPermissionsAsync();
    setHasLocationPermission(response.granted);
    if (response.granted) {
      const { coords } = await getCurrentPositionAsync();
      setLocation(coords);
    }
  };

  const onMessage = (data: WebViewMessageEvent) => {
    Toast.show({ text1: 'ROUTE CHANGED', text2: data.nativeEvent.data })
    console.log('ROUTE CHANGED',data.nativeEvent.data)
  };

  useFocusEffect(
    useCallback(() => {
      if (hasLocationPermission === false) {
        Toast.show({ type: "error", text1: "Has no permission to location" });
        getLocation();
      } else {
        const id = setInterval(() => {
          getCurrentPositionAsync().then((data) => {
            webviewRef.current?.postMessage(JSON.stringify(data.coords));
            setLocation(data.coords);
          });
        }, 10000);
      }
    }, [hasLocationPermission])
  );

  useEffect(() => {
    getLocation();
  }, []);

  if (!mapCoords)
    return <Text>Something went wrong. Please try again later</Text>;
  if (hasLocationPermission === false)
    return <Text>This app has no permission to your location</Text>;
  return (
    <View style={styles.container}>
      <Map
        endLat={+mapCoords.end.Locations[0].Coords.Lat}
        endLng={+mapCoords.end.Locations[0].Coords.Lon}
        startLat={+mapCoords.start.Locations[0].Coords.Lat}
        startLng={+mapCoords.start.Locations[0].Coords.Lon}
        id="MAP2"
        onMessage={onMessage}
        ref={webviewRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ActiveOrderMap;
