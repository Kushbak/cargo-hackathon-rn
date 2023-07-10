import { Text, StyleSheet } from "react-native";

type Props = {
  children: JSX.Element | string;
  level: 1 | 2 | 3 | 4 | 5;
};

const Title = ({ children, level }: Props) => {
  const style = StyleSheet.compose(styles.baseStyles, styles[`h${level}`]);
  return <Text style={style}>{children}</Text>;
};

const styles = StyleSheet.create({
  baseStyles: {
    color: '#000',
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 32
  },
  h2: {
    fontSize: 28
  },
  h3: {
    fontSize: 22
  },
  h4: {
    fontSize: 16
  },
  h5: {
    fontSize: 12
  },
});

export default Title;
