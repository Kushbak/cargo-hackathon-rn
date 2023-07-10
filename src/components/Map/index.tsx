import { forwardRef } from "react";
import { View, StyleSheet } from "react-native";
import WebView, { WebViewMessageEvent } from "react-native-webview";

type PreviewMapProps = {
  id: string;
  startLng: number;
  startLat: number;
  endLng: number;
  endLat: number;
};

export const PreviewMap = ({
  endLat,
  endLng,
  id,
  startLat,
  startLng,
}: PreviewMapProps) => {
  const URL = process.env.EXPO_PUBLIC_PREVIEW_MAP_URL;
  return (
    <WebView
      id={id}
      source={{
        uri: `${URL}?startLng=${startLng}&startLat=${startLat}&endLng=${endLng}&endLat=${endLat}`,
      }}
      style={styles.webview}
    />
  );
};

type MapProps = {
  onMessage?: (data: WebViewMessageEvent) => void;
} & PreviewMapProps;

export const Map = forwardRef(
  ({ endLat, endLng, id, startLat, startLng, onMessage }: MapProps, ref) => {
    const URL = process.env.EXPO_PUBLIC_MAP_URL;

    const handleMessage = (event: WebViewMessageEvent) => {
      onMessage?.(event);
    };

    return (
      <WebView
        ref={ref}
        id={id}
        source={{
          uri: `${URL}?startLng=${startLng}&startLat=${startLat}&endLng=${endLng}&endLat=${endLat}`,
        }}
        style={styles.webview}
        onMessage={handleMessage}
      />
    );
  }
);

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
