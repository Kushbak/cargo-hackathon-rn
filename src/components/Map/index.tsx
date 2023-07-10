import { View, StyleSheet } from "react-native";
import WebView from "react-native-webview";

type Props = {
  id: string
  startLng: number;
  startLat: number;
  endLng: number;
  endLat: number;
};

const Map = ({ endLat, endLng, id, startLat, startLng }: Props) => {
  const onMessage = (x: any) => {};
  return (
    <WebView
      id={id}
      source={{
        uri: `${process.env.EXPO_PUBLIC_MAP_URL}?startLng=${startLng}&startLat=${startLat}&endLng=${endLng}&endLat=${endLat}`,
      }}
      style={styles.webview}
      onMessage={onMessage}
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
export default Map;
