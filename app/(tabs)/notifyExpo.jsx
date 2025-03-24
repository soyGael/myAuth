import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function NotificationsScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      {expoPushToken ? (
        <View style={styles.tokenContainer}>
          <Text style={styles.tokenText}> Token de Notificación:</Text>
          <Text selectable style={styles.tokenValue}>
            {expoPushToken}
          </Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={schedulePushNotification}
      >
        <Ionicons name="send" size={16} color="#fff" />
        <Text style={styles.buttonText}> Enviar Notificación</Text>
      </TouchableOpacity>
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Ganaste un Ipad",
      body: "Descarga ngrok zip para ganar una Ipad versión Elon Musk!!!.",
      data: { extraData: "Soy Sans" },
      sound: "default",
    },
    trigger: { seconds: 5 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Permisos denegados",
        "No se otorgaron permisos para notificaciones."
      );
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo Push Token:", token);
  } else {
    Alert.alert(
      "Error",
      "Debes usar un dispositivo físico para recibir notificaciones."
    );
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000000", 
    textAlign: "center",
  },
  tokenContainer: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    borderColor: "#FF0000",
    borderWidth: 2,
  },
  tokenText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF0000",
  },
  tokenValue: {
    fontSize: 14,
    color: "#000000", 
    textAlign: "center",
  },
  button: {
    backgroundColor: "#FF0000",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff", 
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  notificationContainer: {
    backgroundColor: "#f8d7da",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "90%",
    marginTop: 20,
    borderColor: "#FF0000",
    borderWidth: 2,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000",
    marginBottom: 8,
  },
  notificationText: {
    fontSize: 14,
    color: "#000000", 
    textAlign: "left",
  },
  bold: {
    fontWeight: "bold",
    color: "#FF0000", 
  },
});
