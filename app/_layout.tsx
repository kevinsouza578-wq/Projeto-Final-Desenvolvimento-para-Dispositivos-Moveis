import { cor } from '@/constants/oficina';
import { auth } from '@/firebase';
import { Stack } from 'expo-router';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
  const [usuario, setUsuario] = useState<User | null>(null);
  const [carregando, setCarregando] = useState(true);
  useEffect(() => onAuthStateChanged(auth, (u) => { setUsuario(u); setCarregando(false); }), []);
  if (carregando) return <View style={{ flex: 1, justifyContent: 'center', backgroundColor: cor.fundo }}><ActivityIndicator color={cor.azul} size="large" /></View>;
  return <>
    <Stack screenOptions={{ headerStyle: { backgroundColor: cor.azul }, headerTintColor: 'white', contentStyle: { backgroundColor: cor.fundo } }}>
      <Stack.Protected guard={!usuario}><Stack.Screen name="(auth)" options={{ headerShown: false }} /></Stack.Protected>
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="ordem/[id]" options={{ title: 'Detalhes do serviço' }} />
        <Stack.Screen name="editar/[id]" options={{ title: 'Editar serviço' }} />
      </Stack.Protected>
    </Stack>
    <Toast />
  </>;
}
