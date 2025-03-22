import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Platform } from "react-native";
import { useSession } from "../../ctx"; // Importa el contexto para acceder al token
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useState, useEffect, useRef } from "react";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Index() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [channels, setChannels] = useState([]);
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { session, signOut, myToken } = useSession();

  const registerForPushNotificationsAsync = async () => {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("No se concedieron permisos para las notificaciones.");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token); // Este es el token que necesitas
    } else {
      alert("Debes usar un dispositivo físico para recibir notificaciones.");
    }

    return token;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    if (Platform.OS === "android") {
      Notifications.getNotificationChannelsAsync().then((value) =>
        setChannels(value ?? [])
      );
    }

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
      {session && (
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {session ? `Bienvenido, ${session.correo}` : "Auth App"}
      </Text>
      <Text>Your authentication token: {myToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map((c) => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>Title: {notification?.request?.content?.title || ""} </Text>
        <Text>Body: {notification?.request?.content?.body || ""}</Text>
        <Text>
          Data:{" "}
          {notification
            ? JSON.stringify(notification.request.content.data)
            : ""}
        </Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signOutButton: {
    position: "absolute",
    top: 10,
    right: 0,
    backgroundColor: "black",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: "Here is the notification body",
      data: { data: "goes here", test: { test1: "more data" } },
      sound: "default",
    },
    shouldPlaySound: true,
    trigger: { type: "timeIntervall", seconds: 10, repeats: false },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("myNotificationChannel", {
      name: "A channel is needed for the permissions prompt to appear",
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
      alert("Failed to get push token for push notification!");
      return;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
