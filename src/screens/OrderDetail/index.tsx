import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useStoreon } from "storeon/react";
import Toast from "react-native-toast-message";
import { Camera, CameraType } from "expo-camera";
import { OrderDetailsListScreenProps } from "../types";
import { ordersApi, trimbleApi } from "../../api";
import Loader from "../../components/Loader";
import CustomButton from "../../components/Button";
import { Order, OrderStatus, TrimbleRouteCoordinates } from "../../store/types";
import { Events, States } from "../../store";
import InfoBlock from "../../components/InfoBlock";
import OrderWay from "../../components/OrderWay";
import NoDataText from "../../components/NoDataText";
import Title from "../../components/Title";
import { useFocusEffect } from "@react-navigation/native";
import { ORDER_STATUSES_WITH_MAP_PREVIEW, Screens } from "../../const";
import { PreviewMap } from "../../components/Map";

// TODO REFACTOR THIS PAGE
const OrderDetail = ({ route, navigation }: OrderDetailsListScreenProps) => {
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [mapCoords, setMapCoords] = useState<TrimbleRouteCoordinates | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isOrderBtnLoading, setIsOrderBtnLoading] = useState(false);
  const [isMapLoading, setIsMapLoading] = useState(false);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const { pictureUri, dispatch } = useStoreon<States, Events>("pictureUri");

  const showLimitOrdersError = (error: any) => {
    if (error.message) {
      console.log(error);
      if (error.statusCode === 500) {
        Toast.show({
          type: "error",
          text1: "Server Error. Please try again later",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "You cannot accept more than 1 order",
          text2: "Please, finish the accepted order",
        });
      }
    }
  };

  const acceptOrder = () => {
    if (!orderDetail) return Promise.reject();
    setIsOrderBtnLoading(true);
    ordersApi
      .acceptOrder(orderDetail.id)
      .then((data) => {
        setOrderDetail(data);
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const startOrder = () => {
    if (!orderDetail) return Promise.reject();
    setIsOrderBtnLoading(true);
    ordersApi
      .startShipping(orderDetail.id)
      .then((data) => {
        setOrderDetail(data);
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const deliverOrder = () => {
    if (!orderDetail) return Promise.reject();
    setIsOrderBtnLoading(true);
    ordersApi
      .deliveredShipping(orderDetail.id)
      .then((data) => {
        setOrderDetail(data);
      })
      .catch(showLimitOrdersError)
      .finally(() => setIsOrderBtnLoading(false));
  };

  const finishOrder = async (photoUri: string) => {
    try {
      console.log("clicked", { orderDetail });
      if (!orderDetail) return Promise.reject();
      setIsOrderBtnLoading(true);

      const formData = new FormData();
      // TODO
      // @ts-ignore
      formData.append("file", {
        uri: photoUri,
        name: "doc.jpg",
        type: "image/jpeg",
      });
      ordersApi
        .finishShipping(orderDetail.id, formData)
        .then((data) => {
          setOrderDetail(data);
          dispatch("orders/setPictureUri", null);
        })
        .catch(showLimitOrdersError)
        .finally(() => setIsOrderBtnLoading(false));
    } catch (e) {
      console.log("FUCKING ERROR", { e });
    }
  };

  const setOrderDetailDataToScreen = (data: Order) => {
    setOrderDetail(data);
    navigation.setOptions({
      headerTitle: `[ ${data.id} ]  ${data.pickup_location} -> ${data.destination}`,
    });
  };

  const getTrimbleMaps = (data: Order) => {
    if (!ORDER_STATUSES_WITH_MAP_PREVIEW.includes(data.status)) return;

    setIsMapLoading(true);
    return trimbleApi
      .getLocation({ start: data.pickup_location, end: data.destination })
      .then((data) => setMapCoords(data))
      .finally(() => setIsMapLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    ordersApi
      .getOrderById(route.params.orderId)
      .then((data) => {
        setOrderDetailDataToScreen(data);
        return data;
      })
      .then((data) => getTrimbleMaps(data))
      .finally(() => setIsLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(orderDetail?.status, { pictureUri });
      if (!permission) {
        requestPermission();
      }
    }, [permission])
  );

  const orderBtnsMap: Record<OrderStatus, JSX.Element | null> = {
    [OrderStatus.waiting]: (
      <CustomButton
        accessibilityLabel="Accept Order"
        btnType="outlined"
        onPress={acceptOrder}
        title={isOrderBtnLoading ? "ACCEPTING..." : "ACCEPT ORDER"}
      />
    ),
    [OrderStatus.accepted]: (
      <CustomButton
        accessibilityLabel="Start order"
        btnType="filled"
        onPress={startOrder}
        title={isOrderBtnLoading ? "STARTING..." : "START DELIVERING"}
      />
    ),
    [OrderStatus.on_way]: (
      <CustomButton
        accessibilityLabel="COMPLETE DELIVER ORDER"
        btnType="filled"
        onPress={deliverOrder}
        title={isOrderBtnLoading ? "DELIEVERING..." : "COMPLETE THE DELIVERY"}
      />
    ),
    [OrderStatus.delivered]: (
      <CustomButton
        accessibilityLabel="Finish order"
        btnType="filled"
        onPress={() => finishOrder(pictureUri)}
        title={isOrderBtnLoading ? "FINISHING..." : "FINISH DELIVERING"}
      />
    ),
    [OrderStatus.finished]: null,
    [OrderStatus.not_paid]: null,
  };

  console.log(orderDetail?.status);

  if (isLoading) return <Loader />;
  if (!orderDetail) return <NoDataText />;
  return (
    <ScrollView
      contentContainerStyle={styles.orderDetailContentContainer}
      style={styles.orderDetailContainer}
    >
      <View style={styles.pointContainer}>
        <OrderWay
          delivery_date={orderDetail.delivery_date}
          destination={orderDetail.destination}
          pickup_date={orderDetail.pickup_date}
          pickup_location={orderDetail.pickup_location}
        />
      </View>
      <View style={styles.orderInfoBlock}>
        <Title level={2}>Info</Title>
        <View style={styles.orderDetailContent}>
          <InfoBlock
            title="Weight"
            value={orderDetail.weight + "lbs"}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Type"
            value={orderDetail.type}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Pick Up"
            value={orderDetail.pickup_location}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Destination"
            value={orderDetail.destination}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Special Instructions"
            value={orderDetail.special_instructions}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Status"
            value={orderDetail.status}
            style={styles.orderInfoBlockContainer}
          />
        </View>
      </View>

      <View style={styles.orderInfoBlock}>
        <Title level={2}>Shipper</Title>
        <View style={styles.orderDetailContent}>
          <InfoBlock
            title="Name"
            value={`${orderDetail.shipper?.user?.firstname} ${orderDetail.shipper?.user?.lastname}`}
            style={styles.orderInfoBlockContainer}
          />
          <InfoBlock
            title="Phone"
            value={orderDetail.shipper?.user?.phone}
            style={styles.orderInfoBlockContainer}
          />
        </View>
      </View>
      {isMapLoading ? (
        <Loader />
      ) : (
        mapCoords && (
          <View style={styles.mapPreviewContainer}>
            <PreviewMap
              id="MAP1"
              endLat={+mapCoords.end.Locations[0].Coords.Lat}
              endLng={+mapCoords.end.Locations[0].Coords.Lon}
              startLat={+mapCoords.start.Locations[0].Coords.Lat}
              startLng={+mapCoords.start.Locations[0].Coords.Lon}
            />
          </View>
        )
      )}
      <View style={styles.actionsBlock}>
        {orderDetail.status === OrderStatus.on_way && (
          <CustomButton
            accessibilityLabel="Go To Map"
            btnType="filled"
            title="Go deliver"
            onPress={() =>
              navigation.navigate(Screens.activeOrderMap, {
                mapCoords,
                order: orderDetail,
              })
            }
          />
        )}
        {orderDetail.status === OrderStatus.delivered &&
          (pictureUri ? (
            <Text style={{ flexDirection: "row", alignItems: "center" }}>
              Document Selected
              <CustomButton
                accessibilityLabel="take another"
                btnType="link"
                onPress={() =>
                  navigation.navigate(Screens.cameraScreen, {
                    orderId: orderDetail.id,
                  })
                }
                title="Take another"
              />
            </Text>
          ) : (
            <CustomButton
              title="Scan Document"
              accessibilityLabel="Button to open camera and scan document"
              btnType="outlined"
              onPress={() =>
                navigation.navigate(Screens.cameraScreen, {
                  orderId: orderDetail.id,
                })
              }
            />
          ))}
        {orderDetail ? orderBtnsMap[orderDetail.status] : <></>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  camera: {
    height: 300,
  },
  orderDetailContainer: {
    flex: 1,
    padding: 20,
  },
  orderDetailContentContainer: {
    paddingBottom: 40,
  },
  pointContainer: {
    marginVertical: 20,
    borderBottomColor: "#111",
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomStyle: "dotted",
  },
  orderInfoBlock: {
    marginVertical: 20,
  },
  orderDetailContent: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: "grey",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomStyle: "dotted",
  },
  orderInfoBlockContainer: {
    flexBasis: "45%",
  },
  actionsBlock: {
    width: "100%",
    flex: 1,
    marginTop: 30,
  },
  mapPreviewContainer: {
    height: 200,
    marginVertical: 20,
  },
});

export default OrderDetail;
