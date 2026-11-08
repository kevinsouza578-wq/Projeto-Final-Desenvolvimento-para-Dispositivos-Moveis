import { cor } from '@/constants/oficina';
import { auth } from '@/firebase';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments } from 'expo-router';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [fontesCarregadas] = useFonts({
    ...Ionicons.font,
  });
  const segments = useSegments();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUsuario(u);
      setCarregando(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (carregando || !fontesCarregadas) return;

    const noAuth = segments[0] === '(auth)';

    if (!usuario && !noAuth) {
      router.replace('/(auth)');
    } else if (usuario && noAuth) {
      router.replace('/(tabs)');
    }
  }, [usuario, carregando, fontesCarregadas, segments]);

  if (carregando || !fontesCarregadas) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cor.fundo }}>
        <ActivityIndicator color={cor.azul} size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerStyle: { backgroundColor: cor.azul }, headerTintColor: 'white', contentStyle: { backgroundColor: cor.fundo } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ordem/[id]" options={{ title: 'Detalhes do serviço' }} />
        <Stack.Screen name="editar/[id]" options={{ title: 'Editar serviço' }} />
      </Stack>
      <Toast />
    </>
  );
}
