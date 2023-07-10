import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Order } from "../../store/types";
import OrderWay from "../OrderWay";
import { forwardRef } from "react";

type Props = {
  order: Order;
  key?: string | number;
  isActiveOrder?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

const OrderItem = ({ order, isActiveOrder, onPress, style }: Props) => {
  const orderStyle = StyleSheet.compose(style || {}, styles.orderItem);
  return (
    <Pressable key={order.id} onPress={onPress} style={orderStyle}>
      <View style={styles.orderInfo}>
        <View>
          <Text style={styles.price}>{order.price}$</Text>
          <Text>{order.weight}lbs</Text>
        </View>
        <Text>ID{order.id}</Text>
      </View>

      <OrderWay
        delivery_date={order.delivery_date}
        destination={order.destination}
        pickup_date={order.pickup_date}
        pickup_location={order.pickup_location}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 8,
    height: 140,
  },
  orderInfo: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  price: {
    fontSize: 32,
  },
});

export default OrderItem;
