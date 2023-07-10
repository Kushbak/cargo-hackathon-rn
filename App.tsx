import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StoreContext } from 'storeon/react'
import Home from "./src/screens/Home";
import Login from "./src/screens/Login";
import Register from "./src/screens/Register";
import { Screens } from "./src/const";
import { StackRoutes } from "./src/screens/types";
import { store } from "./src/store";
import ChatItem from "./src/screens/ChatItem";
import Toast from "react-native-toast-message";
import OrderDetail from "./src/screens/OrderDetail";
import CameraScreen from "./src/screens/CameraScreen";
import ActiveOrderMap from "./src/screens/ActiveOrderMap";

const Stack = createNativeStackNavigator<StackRoutes>();
export default function App() {
  return (
    <StoreContext.Provider value={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={Screens.home}
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name={Screens.login}
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen name={Screens.register} component={Register} options={{ headerTitle: 'Registration' }} />
          <Stack.Screen name={Screens.chatItem} component={ChatItem} />
          <Stack.Screen name={Screens.orderDetail} component={OrderDetail} />
          <Stack.Screen name={Screens.cameraScreen} component={CameraScreen} />
          <Stack.Screen name={Screens.activeOrderMap} component={ActiveOrderMap} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </StoreContext.Provider>
  );
}
