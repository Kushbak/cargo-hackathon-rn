import { useState, useRef } from "react";
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import CustomTextInput from "../../components/TextInput";
import { Screens } from "../../const";
import { LoginScreenProps } from "../types";
import CustomButton from "../../components/Button";
import { authApi } from "../../api";

const Login = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const onLoginClick = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    authApi
      .login({ login: email.trim(), password })
      .then(() => {
        navigation.replace(Screens.home);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.loginContainer}>
        <Image
          source={require("../../images/cargo-code-logo.jpg")}
          style={styles.logo}
        />
        <View style={styles.formContainer}>
          <CustomTextInput
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            value={email}
            onChangeText={(text) => setEmail(text)}
            width="80%"
            label="Email"
            keyboardType="email-address"
            returnKeyType="next"
            textContentType="emailAddress"
            dataDetectorTypes="address"
          />
          <CustomTextInput
            ref={passwordRef}
            onSubmitEditing={onLoginClick}
            value={password}
            onChangeText={(text) => setPassword(text)}
            width="80%"
            label="Password"
            keyboardType="visible-password"
            returnKeyType="send"
            textContentType="password"
            secureTextEntry
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <CustomButton
            accessibilityLabel="Login button"
            btnType="filled"
            onPress={onLoginClick}
            title={isSubmitting ? "Logging in..." : "Login"}
          />
          <View style={styles.haveNoAccContainer}>
            <Text>Have no account yet?</Text>
            <CustomButton
              btnType="link"
              title="Register"
              onPress={() => navigation.navigate(Screens.register)}
              accessibilityLabel="Button to navigate Register Page"
              style={{ paddingLeft: 5, paddingRight: 10 }}
            />
          </View>
          <View style={styles.continueAsGuest}>
            <CustomButton
              btnType="link"
              title="Continue as Guest"
              onPress={() => navigation.navigate(Screens.home)}
              accessibilityLabel="Button to navigate Home Page"
              style={{ paddingLeft: 5, paddingRight: 10 }}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    display: "flex",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 80 : 20,
    backgroundColor: "#ffffff",
    height: "100%",
  },
  logo: {
    height: 80,
    width: "90%",
    resizeMode: "cover",
  },
  formContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    marginVertical: 60,
    gap: 10,
  },
  haveNoAccContainer: {
    display: "flex",
    marginTop: 12,
    flexDirection: "row",
  },
  continueAsGuest: {},
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default Login;
