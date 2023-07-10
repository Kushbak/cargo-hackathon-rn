import { Text, View, NativeModules, StyleSheet } from "react-native";
// import { WebView } from "react-native-webview";
import { ActiveOrderMapScreenProps } from "../types";
import Map from "../../components/Map";

const ActiveOrderMap = ({ route }: ActiveOrderMapScreenProps) => {
  const { orderId } = route.params
  
  const onMessage = (x: any) => {};
  return (
    <View style={styles.container}>
      {/* <Map  /> */}
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
