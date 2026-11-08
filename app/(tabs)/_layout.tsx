import { cor } from '@/constants/oficina';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function Abas() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: cor.destaque, tabBarInactiveTintColor: '#CBDAE8', tabBarStyle: { backgroundColor: cor.azul, height: 62, paddingBottom: 7, paddingTop: 6 } }}>
    <Tabs.Screen name="index" options={{ title: 'Painel', tabBarIcon: ({ color, size }) => <Ionicons name="grid" color={color} size={size} /> }} />
    <Tabs.Screen name="ordens" options={{ title: 'Serviços', tabBarIcon: ({ color, size }) => <Ionicons name="list" color={color} size={size} /> }} />
    <Tabs.Screen name="nova" options={{ title: 'Nova OS', tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} /> }} />
    <Tabs.Screen name="perfil" options={{ title: 'Conta', tabBarIcon: ({ color, size }) => <Ionicons name="person-circle" color={color} size={size} /> }} />
  </Tabs>;
}
