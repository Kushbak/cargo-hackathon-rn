import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { OrdersListScreenProps } from "../types";
import { ordersApi } from "../../api";
import Loader from "../../components/Loader";
import { Order } from "../../store/types";
import NoDataText from "../../components/NoDataText";
import { SOCKET_EVENTS, Screens } from "../../const";
import OrderItem from "../../components/OrderItem";
import socket from "../../utils/socket";

const OrdersList = ({ navigation }: OrdersListScreenProps) => {
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setIsOrdersLoading(true);
    ordersApi
      .getAllOrders()
      .then((data) => {
        setOrders(
          data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      })
      .finally(() => setIsOrdersLoading(false))
  }, []);

  useEffect(() => {
    const eventhandler = (data: any) => {
      setOrders((prevState) => ([data, ...prevState]))
    }
    socket.on(SOCKET_EVENTS.createOrder, eventhandler);

    return () => {
      socket.off(SOCKET_EVENTS.createOrder, eventhandler)
    }
  }, [orders]);

  return (
    <View style={styles.ordersListContainer}>
      {!isOrdersLoading ? (
        <ScrollView style={styles.ordersList}>
          {orders.length ? (
            orders.map((item) => (
              <Pressable
                key={item.id}
                style={styles.ordersItem}
                onPress={() => navigation.navigate(Screens.orderDetail, { orderId: item.id })}
              >
                <OrderItem order={item} />
              </Pressable>
            ))
          ) : (
            <NoDataText />
          )}
        </ScrollView>
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ordersListContainer: {
    padding: 20,
    flex: 1,
  },
  ordersList: {},
  ordersContentList: {},
  ordersItem: {
    height: 60,
  },
});

export default OrdersList;
