import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import socket from "../../utils/socket";
import { ChatListScreenProps } from "../types";
import { Screens } from "../../const";
import { ordersApi } from "../../api";
import { Order } from "../../store/types";
import Loader from "../../components/Loader";
import NoDataText from "../../components/NoDataText";

const ChatList = ({ navigation }: ChatListScreenProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ordersApi
      .getMyOrders()
      .then((data) => {
        setOrders(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;
  return (
    <View style={styles.chatListContainer}>
      {orders.length ? (
        orders.map((item) => (
          <Pressable
            style={styles.chatItem}
            onPress={() =>
              navigation.navigate(Screens.chatItem, { orderId: item.id })
            }
          >
            <Text>
              {item.shipper?.user?.firstname} {item.shipper?.user?.lastname}
            </Text>
            <Text>
              {item.pickup_location} {"=>"} {item.destination}
            </Text>
          </Pressable>
        ))
      ) : (
        <NoDataText />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatListContainer: {
    flex: 1,
    padding: 20,
  },
  chatItem: {
    padding: 12,
    height: 60,
    backgroundColor: "#fff",
  },
});

export default ChatList;
