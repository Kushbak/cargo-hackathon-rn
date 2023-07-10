import React, { useRef, useEffect } from "react";
import { Animated, View, Text, StyleSheet, Easing } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Loader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    rotateAnimation.start();

    return () => {
      rotateAnimation.stop();
    };
  }, [rotateValue]);

  const rotateInterpolation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.textContainer,
          { transform: [{ rotate: rotateInterpolation }] },
        ]}
      >
        <FontAwesome style={styles.truck} name="truck" />
      </Animated.View>
    </View>
  );
};

export const DotLoader = () => {
  const dot1Opacity = useRef(new Animated.Value(1)).current;
  const dot2Opacity = useRef(new Animated.Value(1)).current;
  const dot3Opacity = useRef(new Animated.Value(1)).current;

  const animateDots = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Opacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 0,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.sin,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    animateDots();
  }, []);
  return (
    <View style={styles.dotLoaderContainer}>
      <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
  },
  truck: {
    transform: [{ rotateY: '-200deg' }]
  },
  dotLoaderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    gap: 3,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111",
  },
});

export default Loader;
