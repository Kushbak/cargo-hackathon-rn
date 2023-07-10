import { Text, StyleSheet, View, ViewStyle } from "react-native"

type Props = {
  title: string
  value?: string | number | null
  style?: ViewStyle
}

const InfoBlock = ({ title, value, style }: Props) => {
  const infoContainerStyle = StyleSheet.compose(styles.container, style)
  return (
    <View style={infoContainerStyle}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    height: 20,
  },
  title: {
    color: '#111',
    fontSize: 14,
    marginBottom: 2,
  },
  value: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default InfoBlock