
import {
  GestureResponderEvent,
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
  StyleSheet,
  Platform,
} from "react-native";

type Props = {
  title: string;
  btnType: keyof typeof btnTypeStyles;
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
  const btnStyles = StyleSheet.compose(style, btnTypeStyles[btnType])
  return (
    <Pressable
      style={btnStyles}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={btnTextTypeStyles[btnType]}>{title}</Text>
    </Pressable>
  );
};

export default CustomButton;

const btnTypeStyles = StyleSheet.create({
  filled: {
    width: 200,
    backgroundColor: "#2464ad",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  outlined: {
    borderRadius: 12,
    borderColor: "#2464ad",
    borderWidth: 1,
    borderStyle: "solid",
    padding: 12,
  },
  link: {},
});

const btnTextTypeStyles = StyleSheet.create({
  filled: {
    color: "#ffffff",
  },
  outlined: {
    color: "#2464ad",
  },
  link: {
    color: "skyblue",
  },
});
