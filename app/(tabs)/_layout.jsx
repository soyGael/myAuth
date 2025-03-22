import { Text } from 'react-native';
import { Redirect, Stack, Tabs} from 'expo-router';
import { useSession } from '../../ctx'; 

export default function AppLayout() {
  const { session, isLoading } = useSession(); 

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#ffd33d",
      headerStyle: {
        backgroundColor: "#25292e",
      },
      headerShadowVisible: false,
      headerTintColor: "#fff",
      tabBarStyle: {
        backgroundColor: "#25292e",
      },
    }}
  >
    <Tabs.Screen
      name="index"
      options={{
        title: "Home",
      }}
    />
    <Tabs.Screen
      name="push"
      options={{
        title: "Push",
      }}
    />
  </Tabs>
  );
}
