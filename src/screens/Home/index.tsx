import { useEffect, useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useStoreon } from "storeon/react";
import OrdersList from "../OrdersList";
import Profile from "../Profile";
import { HomeScreenProps, StackRoutes } from "../types";
import { authApi, ordersApi } from "../../api";
import { ACTIVE_ORDER_STATUSES, SOCKET_EVENTS, Screens } from "../../const";
import Loader from "../../components/Loader";
import ActiveOrderMap from "../ActiveOrderMap";
import socket from "../../utils/socket";
import ChatList from "../ChatList";
import Toast from "react-native-toast-message";
import { Events, States } from "../../store";
import { OrderStatus } from "../../store/types";
import { useFocusEffect } from "@react-navigation/native";

const Tab = createBottomTabNavigator<StackRoutes>();

const Home = ({ navigation }: HomeScreenProps) => {
  const [fetchingUserData, setFetchingUserData] = useState(true);
  const { dispatch, activeOrder, profileData } = useStoreon<States, Events>(
    "activeOrder",
    "profileData"
  );

  const connectReceiveOrdersSocket = () => {
    socket.connect();
    Toast.show({
      text1: "socket connected",
    });
    socket.on(SOCKET_EVENTS.receiveMessage, (message) => {
      Toast.show({
        text1: `${message.author?.firstname} ${message.author?.lastname}`,
        text2: message.text,
      });
    });
  };

  const getProfileData = async () => {
    const data = await authApi.getProfile();
    dispatch("profile/save", data);
  };

  const setMyActiveOrder = async () => {
    if (activeOrder || !profileData) return Promise.reject();

    const data = await ordersApi.getMyOrders();
    const activeStatusOrder = data.find(
      (item) => ACTIVE_ORDER_STATUSES.includes(item.status) && item.carrier.id === profileData?.id
    );
    dispatch("orders/setActiveOrder", activeStatusOrder);
  };

  useEffect(() => {
    setFetchingUserData(true);
    authApi
      .getToken()
      .then((token) => {
        console.log({ token });
        if (!token) return navigation.replace(Screens.login);
      })
      .finally(() => setFetchingUserData(false))
      .then(getProfileData)
      .then(connectReceiveOrdersSocket);
  }, []);

  useFocusEffect(useCallback(() => {
    if(profileData) {
      setMyActiveOrder()
    }
  }, [activeOrder, profileData]))

  if (fetchingUserData) return <Loader />;
  return (
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen
          name="OrdersList"
          component={OrdersList}
          options={{ headerTitle: "Orders" }}
        />
        <Tab.Screen
          name="ChatList"
          component={ChatList}
          options={{ headerTitle: "Chat" }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{ headerTitle: "Profile" }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Цвет фона
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16, // Отступы по горизонтали
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Home;
