import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useSession } from "../ctx";
import { router } from "expo-router";

export default function SignIn() {
  const { signIn } = useSession();
  const [useCorreo, setCorreo] = useState("");
  const [usePass, setPass] = useState("");

  const handleSignIn = async () => {
    const emailLower = useCorreo;
    const passLower = usePass;

    try {
      // Llamada al endpoint de la API con Axios
      const response = await axios.post("https://5dc3-2806-10be-8-5011-dcb-edf1-8be6-b53a.ngrok-free.app/auth", {
        email: emailLower,
        password: passLower
      });

      if (response.status === 200) {
        const { message, data } = response.data;
      
        // Guarda la sesión del usuario y el token
        signIn(emailLower, data.token);
        console.log("Inicio de sesión exitoso:", message);
        console.log("Token recibido:", data.token);
      
        // Redirige al usuario
        setTimeout(() => router.replace("/"), 500);
      }
    } catch (error) {
      // Manejo del error
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Error al conectar con el servidor.");
      }
      console.error(
        "Detalles del error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingresa tus datos</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        keyboardType="email-address"
        value={useCorreo}
        onChangeText={setCorreo}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={usePass}
        onChangeText={setPass}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
