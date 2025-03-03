import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSession } from "../../ctx";

export default function Index() {
  const { session, signOut } = useSession();  

  return (
    <View style={styles.container}>
      {session && (
        <TouchableOpacity
          onPress={signOut}
          style={styles.signOutButton}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.title}>
        {session ? `Bienvenido, ${session.correo}` : "Auth App"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signOutButton: {
    position: 'absolute',
    top: 10,
    right: 0,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
