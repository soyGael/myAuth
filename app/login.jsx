import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSession } from '../ctx';
import { router } from 'expo-router';

const correo = 'usuario@ejemplo.com';
const password = 'password123';

export default function SignIn() {
  const { signIn } = useSession();
  const [useCorreo, setCorreo] = useState('');
  const [usePass, setPass] = useState('');

  const handleSignIn = () => {
    if (useCorreo === correo && usePass === usePass) {
      signIn(useCorreo); 
      setTimeout(() => router.replace('/'), 500);
    } else {
      alert('Credenciales inválidas ❌');
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
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}>
        <Text style={styles.buttonText}>Iniciar sesión</Text>
      </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
