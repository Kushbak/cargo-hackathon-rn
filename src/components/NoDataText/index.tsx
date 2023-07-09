import { StyleSheet, Text } from "react-native";

const NoDataText = () => {
  return (
    <Text style={styles.noDatatext}>
      There is no data that you take on last time
    </Text>
  );
};

const styles = StyleSheet.create({
  noDatatext: {
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    marginVertical: 40,
    fontSize: 18,
    borderColor: "grey",
    borderWidth: 1,
    padding: 8,
    borderStyle: "solid",
  },
});

export default NoDataText;
