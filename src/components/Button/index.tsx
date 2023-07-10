import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
} from "react-native";

type Props = {
  title: string;
  btnType: "filled" | "outlined" | "link";
  accessibilityLabel: string;
  onPress: (e: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const CustomButton = ({
  title,
  btnType,
  disabled,
  accessibilityLabel,
  onPress,
  style,
}: Props) => {
  const btnStyles = StyleSheet.compose(style, {
    ...btnTypeStyles[btnType],
    ...btnTypeStyles.baseStyles,
  });
  const textStyles = StyleSheet.compose(
    btnTextTypeStyles.baseStyles,
    btnTextTypeStyles[btnType]
  );
  return (
    <Pressable
      style={btnStyles}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={textStyles}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const btnTypeStyles = StyleSheet.create({
  baseStyles: {
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginVertical: 12,
  },
  filled: {
    width: "100%",
    backgroundColor: "#111111",
  },
  outlined: {
    width: "100%",
    borderColor: "#111111",
    borderWidth: 2,
    borderStyle: "solid",
  },
  link: {
    padding: 0,
    marginVertical: 0,
  },
});

const btnTextTypeStyles = StyleSheet.create({
  baseStyles: {
    fontWeight: 'bold',
    letterSpacing: 1.4,
  },
  filled: {
    color: "#ffffff",
  },
  outlined: {
    color: "#111111",
  },
  link: {
    color: "skyblue",
  },
});
