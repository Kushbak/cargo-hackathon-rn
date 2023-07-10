import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Pressable } from "react-native";
import { useStoreon } from "storeon/react";
import { ProfileScreenProps } from "../types";
import CustomButton from "../../components/Button";
import { authApi, ordersApi } from "../../api";
import { Screens } from "../../const";
import Loader from "../../components/Loader";
import { Events, States } from "../../store";
import { Order, OrderStatus } from "../../store/types";
import NoDataText from "../../components/NoDataText";
import OrderItem from "../../components/OrderItem";

const Profile = ({ navigation }: ProfileScreenProps) => {
  const [isLogingOut, setIsLogingOut] = useState(false);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isMyOrdersLoading, setIsMyOrdersLoading] = useState(false);

  const { dispatch, profileData, activeOrder } = useStoreon<States, Events>(
    "profileData",
    "activeOrder"
  );

  const logout = () => {
    setIsLogingOut(true);
    authApi
      .logout()
      .then(() => {
        navigation.replace(Screens.login);
      })
      .finally(() => setIsLogingOut(false));
  };

  const openOrderDetail = (id: number) => {
    navigation.navigate(Screens.orderDetail, { orderId: id });
  };

  const setMyActiveOrder = () => {
    if (activeOrder) return;
    return ordersApi.getMyOrders().then((data) => {
      dispatch(
        "orders/setActiveOrder",
        data.find(
          (item) =>
            [
              OrderStatus.accepted,
              OrderStatus.delivered,
              OrderStatus.on_way,
            ].includes(item.status) && item.carrier.id === profileData?.id
        )
      );
    });
  };

  const getProfileData = () => {
    if (profileData) return Promise.resolve();
    setIsLogoutLoading(true);
    return authApi
      .getProfile()
      .then((data) => {
        dispatch("profile/save", data);
      })
      .finally(() => setIsLogoutLoading(false));
  };

  const getMyOrders = () => {
    setIsMyOrdersLoading(true);
    return ordersApi
      .getMyOrders()
      .then((data) => {
        setMyOrders(data);
      })
      .finally(() => setIsMyOrdersLoading(false));
  };

  useEffect(() => {
    getProfileData()
      .then(() => getMyOrders())
      .then(() => setMyActiveOrder());
  }, []);

  useEffect(() => {}, []);

  if (isLogoutLoading) return <Loader />;
  return (
    <View style={styles.profileContainer}>
      <View>
        <Text style={styles.col}>First Name: {profileData?.firstname}</Text>
        <Text style={styles.col}>Last Name: {profileData?.lastname}</Text>
        <Text style={styles.col}>Email: {profileData?.email}</Text>
        <Text style={styles.col}>Phone: {profileData?.phone}</Text>
        <Text style={styles.col}>Role: {profileData?.role}</Text>
      </View>

      <View style={styles.myOrdersContainer}>
        <Text style={{ fontSize: 28 }}>Current Order:</Text>
        {isMyOrdersLoading ? (
          <Text>Getting ActiveOrder...</Text>
        ) : activeOrder ? (
          <Pressable onPress={() => openOrderDetail(activeOrder.id)}>
            <OrderItem order={activeOrder} isActiveOrder />
          </Pressable>
        ) : (
          <NoDataText />
        )}
      </View>

      <View style={styles.myOrdersContainer}>
        <Text style={{ fontSize: 28 }}>My Orders:</Text>
        {isMyOrdersLoading ? (
          <Text>Getting Orders...</Text>
        ) : (
          <ScrollView style={styles.myOrders}>
            {myOrders.length ? (
              myOrders.map((item) => (
                <Pressable
                  onPress={() => openOrderDetail(item.id)}
                  key={item.id}
                >
                  <OrderItem order={item} />
                </Pressable>
              ))
            ) : (
              <NoDataText />
            )}
          </ScrollView>
        )}
      </View>
      <View style={styles.actionBtns}>
        <CustomButton
          accessibilityLabel="Log Out"
          btnType="filled"
          onPress={logout}
          title={isLogingOut ? "Loging out..." : "Log Out"}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 20,
  },
  col: {
    padding: 12,
    fontSize: 22,
  },
  actionBtns: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  myOrdersContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 12,
    borderTopColor: "#eee",
    borderTopWidth: 4,
    borderStyle: "solid",
    backgroundColor: "#eee",
  },
  myOrders: {},
});

export default Profile;
