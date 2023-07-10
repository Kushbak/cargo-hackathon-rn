import React from "react";
import { View, StyleSheet, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
  pickup_location: string;
  pickup_date: string;
  destination: string;
  delivery_date: string;
};

const OrderWay = ({
  delivery_date,
  destination,
  pickup_date,
  pickup_location,
}: Props) => {
  return (
    <View style={styles.way}>
      <View style={styles.pointContainer}>
        <Text style={styles.point}>{pickup_location}</Text>
        <Text style={styles.point_date}>
          {new Date(pickup_date).toDateString()}
        </Text>
      </View>
      <FontAwesome
        style={styles.truckIcon}
        name="truck"
        size={30}
        color={"#111"}
      />
      <View style={styles.pointContainer}>
        <Text style={styles.point}>{destination}</Text>
        <Text style={styles.point_date}>
          {new Date(delivery_date).toDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  way: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  pointContainer: {},
  point: {
    fontSize: 18,
    fontWeight: "bold",
  },
  point_date: {
    fontSize: 12,
  },
  truckIcon: {
    transform: [{ rotateY: "-200deg" }],
  },
});

export default OrderWay;
