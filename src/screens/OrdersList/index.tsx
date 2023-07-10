import { useState, useEffect, useCallback } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { OrdersListScreenProps } from "../types";
import { ordersApi } from "../../api";
import Loader, { DotLoader } from "../../components/Loader";
import { Order } from "../../store/types";
import NoDataText from "../../components/NoDataText";
import { SOCKET_EVENTS, Screens } from "../../const";
import OrderItem from "../../components/OrderItem";
import socket from "../../utils/socket";
import { useFocusEffect } from "@react-navigation/native";
import { useStoreon } from "storeon/react";
import { Events, States } from "../../store";

const OrdersList = ({ navigation }: OrdersListScreenProps) => {
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const { dispatch, orders, activeOrder } = useStoreon<States, Events>(
    "orders",
    "activeOrder"
  );

  const setOrders = (newOrders: Order[]) => {
    dispatch(
      "orders/setOrders",
      newOrders.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
    );
  };

  useFocusEffect(
    useCallback(() => {
      setIsOrdersLoading(true);
      ordersApi
        .getAllOrders()
        .then((data) => setOrders(data))
        .finally(() => setIsOrdersLoading(false));
    }, [])
  );

  useEffect(() => {
    const eventhandler = (data: any) => {
      setOrders([data, ...orders]);
    };
    socket.on(SOCKET_EVENTS.createOrder, eventhandler);

    return () => {
      socket.off(SOCKET_EVENTS.createOrder, eventhandler);
    };
  }, [orders]);

  if (isOrdersLoading && !orders) return <Loader />;
  const ordersListStyle = StyleSheet.compose(
    styles.ordersList,
    activeOrder ? styles.ordersListWithActiveOrder : {}
  );
  return (
    <View style={styles.ordersListContainer}>
      {activeOrder && (
        <OrderItem
          order={activeOrder}
          onPress={() =>
            navigation.navigate(Screens.orderDetail, {
              orderId: activeOrder.id,
            })
          }
          style={styles.activeOrder}
        />
      )}
      <ScrollView
        contentContainerStyle={styles.ordersContentList}
        style={ordersListStyle}
      >
        {!!(isOrdersLoading && orders) && <DotLoader />}
        {!!orders.length &&
          orders.map((item, idx) => (
            <OrderItem
              key={item.id}
              order={item}
              onPress={() =>
                navigation.navigate(Screens.orderDetail, { orderId: item.id })
              }
            />
          ))}
        {!orders.length && <NoDataText />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ordersListContainer: {
    flex: 1,
  },
  ordersList: {},
  ordersListWithActiveOrder: {
    paddingTop: 160,
  },
  ordersContentList: {
    display: "flex",
    gap: 4,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "stretch",
  },
  activeOrder: {
    position: "absolute",
    top: 0,
    left: 1,
    right: 1,
    borderColor: "#111111",
    borderWidth: 2,
    borderStyle: "solid",
    backgroundColor: "#eee",
    zIndex: 2,
  },
  nextToActive: {
    marginTop: 120,
  },
});

export default OrdersList;
