import { Text, View, NativeModules, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { ActiveOrderMapScreenProps } from "../types";
import TrimbleMaps from '@trimblemaps/trimblemaps-js'
import MapMenus from '@trimblemaps/trimblemaps-mapmenus'

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.10.0.css" />
    <script src="https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.10.0.js"></script>
    <style>
        body { margin: 0; padding: 0; }

        #map {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
        }

    </style>
  </head>
  <body>
  <div id="map"></div>
    <script>
      TrimbleMaps.APIKey = '3F74044C9937A546A75E4BEB5B1CB455';
      const map = new TrimbleMaps.Map({
        container: 'map', // container id
        style: TrimbleMaps.Common.Style.TRANSPORTATION, //hosted style id
        center: [-75, 40], // starting position
        zoom: 9 // starting zoom
      });
    </script>
  </body>
</html>
`;

const ActiveOrderMap = ({}: ActiveOrderMapScreenProps) => {
  const onMessage = (x: any) => {
  };
  // new TrimbleMaps.Route({  })
  return (
    <View style={styles.container}>
      <WebView
        source={{ html: html }}
        style={styles.webview}
        onMessage={onMessage}
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
