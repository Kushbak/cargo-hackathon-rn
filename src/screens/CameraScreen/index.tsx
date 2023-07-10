import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { Camera, CameraCapturedPicture, CameraType } from "expo-camera";
import { useFocusEffect } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import CustomButton from "../../components/Button";
import { useStoreon } from "storeon/react";
import { Events, States } from "../../store";
import { CameraScreenProps } from "../types";

const CameraScreen = ({ navigation }: CameraScreenProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const { dispatch } = useStoreon<States, Events>();

  useFocusEffect(
    useCallback(() => {
      if (!permission?.granted) {
        requestPermission().then((data) => setHasPermission(data.granted));
      } else {
        setHasPermission(permission.granted);
      }
    }, [])
  );

  const takePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const savePhoto = async () => {
    if (photoUri) {
      dispatch("orders/setPictureUri", photoUri);
      navigation.goBack();
    } else {
      Toast.show({
        type: "warning",
        text1: "Something went wrong. Take a picture again",
      });
      setPhotoUri(null);
    }
  };

  const resetPhoto = () => {
    setPhotoUri(null)
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log(photoUri);

  return (
    <View style={styles.container}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
      ) : (
        <Camera
          style={styles.camera}
          ref={(ref) => setCameraRef(ref)}
          type={CameraType.back}
        />
      )}
      {photoUri ? (
        <View style={styles.previewImageBtns}>
          <CustomButton
            title="Select"
            accessibilityLabel="Select this picture"
            btnType="filled"
            onPress={savePhoto}
          />

          <CustomButton
            title="Take another"
            accessibilityLabel="Delete photo and take another picture"
            btnType="outlined"
            onPress={resetPhoto}
          />
        </View>
      ) : (
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    flex: 1,
  },
  previewImageBtns: {
    width: '100%',
    paddingHorizontal: 20,
    alignSelf: "center",
    backgroundColor: '#fff',
  }
});

export default CameraScreen;
