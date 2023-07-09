import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useStoreon } from "storeon/react";
import Toast from "react-native-toast-message";
import { OrderDetailsListScreenProps } from "../types";
import { ordersApi } from "../../api";
import Loader from "../../components/Loader";
import CustomButton from "../../components/Button";
import { Order, OrderStatus } from "../../store/types";
import { Events, States } from "../../store";

const OrderDetail = ({ route, navigation }: OrderDetailsListScreenProps) => {
  const [orderDetail, setOrderDetail] = useState<Order>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderBtnLoading, setIsOrderBtnLoading] = useState(false);
  const { activeOrder } = useStoreon<States, Events>("activeOrder");

  const showLimitOrdersError = (error: any) => {
    if (error.message) {
      Toast.show({
        type: "error",
        text1: "You cannot accept more than 1 order",
        text2: "Please, finish the accepted order",
      });
    }
  };

  const acceptOrder = () => {
    setIsOrderBtnLoading(true);
    ordersApi
      .acceptOrder(orderDetail.id)
      .then((data) => {
        console.log(data);
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const startOrder = () => {
    setIsOrderBtnLoading(true);
    ordersApi
      .startShipping(orderDetail.id)
      .then((data) => {
        console.log(data);
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const deliverOrder = () => {
    setIsOrderBtnLoading(true);
    ordersApi
      .deliveredShipping(orderDetail.id)
      .then((data) => {
        console.log(data)
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const finishOrder = () => {
    setIsOrderBtnLoading(true);
    ordersApi
      .finishShipping(orderDetail.id, {})
      .then((data) => {
        console.log(data)
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    ordersApi
      .getOrderById(route.params.orderId)
      .then((data) => {
        setOrderDetail(data);
        navigation.setOptions({
          headerTitle: `ID-${data.id}${data.pickup_location} => ${data.destination}`,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const orderBtnsMap = {
    [OrderStatus.waiting]: (
      <CustomButton
        accessibilityLabel="Accept Order"
        btnType="filled"
        onPress={acceptOrder}
        title={isOrderBtnLoading ? "ACCEPTING..." : "ACCEPT ORDER"}
      />
    ),
    [OrderStatus.accepted]: (
      <CustomButton
        accessibilityLabel="Start order"
        btnType="filled"
        onPress={startOrder}
        title={isOrderBtnLoading ? "STARTING..." : "START"}
      />
    ),
    [OrderStatus.delivered]: (
      <CustomButton
        accessibilityLabel="Deliever order"
        btnType="filled"
        onPress={deliverOrder}
        title={isOrderBtnLoading ? "DELIEVERING..." : "DELIEVER"}
      />
    ),
    [OrderStatus.finished]: (
      <CustomButton
        accessibilityLabel="Finish order"
        btnType="filled"
        onPress={finishOrder}
        title={isOrderBtnLoading ? "FINISHING..." : "FINISH"}
      />
    ),
  };
  if (isLoading) return <Loader />;
  return (
    <View style={styles.orderDetailContainer}>
      <Text>ORDER DETAIL SCREEN</Text>
      {orderBtnsMap[orderDetail.status] ? (
        <View>{orderBtnsMap[orderDetail.status]}</View>
      ) : (
        <Text></Text>
        // <Text>You cannot take this order</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  orderDetailContainer: {
    flex: 1,
    padding: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default OrderDetail;
