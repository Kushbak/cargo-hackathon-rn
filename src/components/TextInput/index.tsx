import { forwardRef } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";

type Props = {
  label?: string;
  placeholder?: string;
  width?: `${string}%` | number;
  value?: string;
  defaultValue?: string;
  error?: any;
} & TextInputProps;

const CustomTextInput = forwardRef<TextInput, Props>(
  (
    {
      label,
      placeholder,
      width,
      onChangeText,
      value,
      defaultValue,
      error,
      ...props
    },
    ref
  ) => {
    const inputStyle = StyleSheet.compose(
      styles.iosTextInput,
      error ? { borderColor: "red" } : {}
    );

    return (
      <View style={{ width }}>
        {label && (
          <Text style={{ padding: 10, fontSize: 12, color: "grey" }}>
            {label}
          </Text>
        )}
        <View>
          <TextInput
            ref={ref}
            onChangeText={onChangeText}
            defaultValue={defaultValue}
            style={inputStyle}
            placeholder={placeholder}
            {...props}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  iosTextInput: {
    paddingHorizontal: 12,
    fontSize: 14,
    borderColor: "darkgrey",
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "solid",
    width: "100%",
    height: 40,
    color: "black",
    backgroundColor: "white",
  },
  errorText: {
    fontSize: 12,
    color: "red",
  },
});

export default CustomTextInput;
