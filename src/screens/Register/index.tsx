import { useEffect, useState, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TextInput
} from "react-native";
import { PickerIOS } from "@react-native-picker/picker";
import CustomTextInput from "../../components/TextInput";
import { INDIVIDUAL_CARRIER_SELECT_DATA, Screens } from "../../const";
import { RegisterScreenProps } from "../types";
import CustomButton from "../../components/Button";
import { CreateUser, SelectValue } from "../../store/types";
import { companiesApi, usersApi } from "../../api";
import { dataToSelect } from "../../utils";
import Toast from "react-native-toast-message";

const Register = ({ navigation }: RegisterScreenProps) => {
  const [formData, setFormData] = useState<CreateUser>({
    email: "",
    role: "CARRIER",
    phone: "",
    password: "",
    physical_address: "",
    mc_dot_number: "",
    firstname: "",
    lastname: "",
    company_id: -1,
  });
  const [companies, setCompanies] = useState<SelectValue[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | number>(
    INDIVIDUAL_CARRIER_SELECT_DATA.value
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateUser>>({});

  const lastnameRef = useRef<TextInput>(null)
  const emailRef = useRef<TextInput>(null)
  const phoneRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)
  const addressRef = useRef<TextInput>(null)
  const mcdotnumberRef = useRef<TextInput>(null)

  const handleChangeFormData = (name: keyof CreateUser) => (value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onRegisterClick = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    usersApi
      .createCarrierUser({
        ...formData,
        company_id: +selectedCompany,
        email: formData.email.trim(),
      })
      .then((data) => {
        navigation.navigate(Screens.login);
        Toast.show({
          type: 'success',
          text1: 'You are successfully registered!',
          text2: 'Please, use your credentials to log in'
        })
      })
      .catch((e) => {
        const registerErrosMessages: Record<string, string> = {
          "email must be an email": "email",
          "phone must be a valid phone number": "phone",
          "password is not strong enough": "password",
          "company_id must be a number conforming to the specified constraints":
            "company_id",
        };
        const x: Record<string, string> = {};
        for (let errorMsg of e.message) {
          if (registerErrosMessages[errorMsg]) {
            x[registerErrosMessages[errorMsg]] = errorMsg;
          }
        }
        setErrors(x);
      })
      .finally(() => setIsSubmitting(false));
  };

  useEffect(() => {
    companiesApi.getAllCompanies().then((data) => {
      setCompanies([INDIVIDUAL_CARRIER_SELECT_DATA, ...dataToSelect(data)]);
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          style={styles.registerContainer}
          contentContainerStyle={styles.registerContentContainer}
        >
          <View style={styles.formContainer}>
            <CustomTextInput
              onSubmitEditing={() => lastnameRef.current?.focus()}
              onChangeText={handleChangeFormData("firstname")}
              label="First Name"
              returnKeyType="next"
              textContentType="givenName"
            />
            <CustomTextInput
              ref={lastnameRef}
              onSubmitEditing={() => emailRef.current?.focus()}
              onChangeText={handleChangeFormData("lastname")}
              label="Last Name"
              returnKeyType="next"
              textContentType="givenName"
            />
            <CustomTextInput
              ref={emailRef}
              onSubmitEditing={() => phoneRef.current?.focus()}
              onChangeText={handleChangeFormData("email")}
              label="Email"
              returnKeyType="next"
              textContentType="emailAddress"
              keyboardType="email-address"
              error={errors.email}
            />
            <CustomTextInput
              ref={phoneRef}
              onChangeText={handleChangeFormData("phone")}
              label="Phone Number"
              returnKeyType="next"
              textContentType="telephoneNumber"
              keyboardType="number-pad"
              error={errors.phone}
            />
            <View>
              <Text>Please choose a company you are from:</Text>
              <PickerIOS
                selectedValue={selectedCompany}
                key={selectedCompany}
                onValueChange={(value) => setSelectedCompany(value)}
              >
                {companies.map((company) => {
                  return (
                    <PickerIOS.Item
                      key={`${company.label}_${company.value}`}
                      value={company.value}
                      label={company.label}
                    />
                  );
                })}
              </PickerIOS>
              {errors.company_id && (
                <Text style={styles.errorText}>{errors.company_id}</Text>
              )}
            </View>
            <CustomTextInput
              ref={passwordRef}
              onSubmitEditing={() => addressRef.current?.focus()}
              onChangeText={handleChangeFormData("password")}
              label="Password"
              returnKeyType="next"
              textContentType="password"
              error={errors.password}
              secureTextEntry
            />
            <CustomTextInput
              ref={addressRef}
              onSubmitEditing={() => mcdotnumberRef.current?.focus()}
              onChangeText={handleChangeFormData("physical_address")}
              label="Physical Address"
              returnKeyType="next"
              textContentType="fullStreetAddress"
            />
            <CustomTextInput
              ref={mcdotnumberRef}
              onChangeText={handleChangeFormData("mc_dot_number")}
              label="MC DOT Number"
              returnKeyType="done"
            />

            <CustomButton
              accessibilityLabel="Register button"
              btnType="filled"
              onPress={onRegisterClick}
              title={isSubmitting ? "Loading..." : "Register"}
              // disabled={!isSubmitting}
            />
            <View style={styles.haveAccContainer}>
              <Text>Have an account?</Text>
              <CustomButton
                btnType="link"
                title="Login"
                onPress={() => navigation.navigate(Screens.login)}
                accessibilityLabel="Button to navigate login Page"
                style={{ paddingLeft: 5, paddingRight: 10 }}
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  registerContentContainer: {
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 40,
  },
  registerContainer: {
    backgroundColor: "#ffffff",
    height: "100%",
    flex: 1,
  },
  formContainer: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    marginVertical: 30,
    gap: 10,
  },
  haveAccContainer: {
    display: "flex",
    marginTop: 12,
    flexDirection: "row",
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});
