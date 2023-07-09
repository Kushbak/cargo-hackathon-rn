import { StyleSheet, Text, View } from "react-native";
import { Order } from "../../store/types";

type Props = {
  order: Order;
  key?: string | number;
  isActiveOrder?: boolean;
};

const OrderItem = ({ order, isActiveOrder }: Props) => {
  const orderStyle = StyleSheet.compose(
    isActiveOrder
      ? {
          borderColor: "#000",
        }
      : {},
    styles.orderItem
  );
  return (
    <View style={orderStyle}>
      <Text>ID - {order.id}</Text>
      <Text>
        {order.pickup_location} {"=>"} {order.destination}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  orderItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 8,
  },
});

export default OrderItem;
