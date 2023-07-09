import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useStoreon } from "storeon/react";
import OrdersList from "../OrdersList";
import Profile from "../Profile";
import { HomeScreenProps, StackRoutes } from "../types";
import { authApi, ordersApi } from "../../api";
import { SOCKET_EVENTS, Screens } from "../../const";
import Loader from "../../components/Loader";
import ActiveOrderMap from "../ActiveOrderMap";
import socket from "../../utils/socket";
import ChatList from "../ChatList";
import Toast from "react-native-toast-message";
import { Events, States } from "../../store";
import { OrderStatus } from "../../store/types";

const Tab = createBottomTabNavigator<StackRoutes>();

const Home = ({ navigation }: HomeScreenProps) => {
  const [gettingUser, setGettingUser] = useState(true);
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
        text1: `${message.author.firstname} ${message.author.firstname}`,
        text2: message.text,
      });
    });
  };

  const getProfileData = () => {
    return authApi.getProfile().then((data) => {
      dispatch("profile/save", data);
    });
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

  useEffect(() => {
    setGettingUser(true);
    authApi
      .getToken()
      .then((token) => {
        console.log({ token });
        if (!token) return navigation.replace(Screens.login);
      })
      .finally(() => setGettingUser(false))
      .then(() => getProfileData())
      .then(() => setMyActiveOrder())
      .then(() => connectReceiveOrdersSocket());
  }, []);

  if (gettingUser) return <Loader />;
  return (
    <View style={styles.container}>
      <Tab.Navigator>
        <Tab.Screen
          name="OrdersList"
          component={OrdersList}
          options={{ headerTitle: "Orders" }}
        />
        <Tab.Screen
          name="ActiveOrderMap"
          component={ActiveOrderMap}
          options={{ headerTitle: "Map of Active Order" }}
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
