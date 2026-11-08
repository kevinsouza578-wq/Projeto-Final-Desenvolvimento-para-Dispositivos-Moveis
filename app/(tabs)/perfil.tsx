import { cor, estilo } from '@/constants/oficina';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

export default function Perfil() {
  const [saindo, setSaindo] = useState(false);
  async function sair() {
    setSaindo(true);
    try { await signOut(auth); }
    catch { Toast.show({ type: 'error', text1: 'Erro ao sair' }); }
    finally { setSaindo(false); }
  }
  return <SafeAreaView style={estilo.pagina}>
    <View style={estilo.conteudo}>
      <Text style={estilo.titulo}>Minha conta</Text>
      <Text style={estilo.subtitulo}>Sessão autenticada com Firebase.</Text>
      <View style={estilo.card}>
        <Text style={estilo.label}>Usuário conectado</Text>
        <Text style={{ fontWeight: '800', color: cor.azul, fontSize: 16 }}>{auth.currentUser?.email ?? 'Conta de demonstração'}</Text>
        <Text style={{ color: cor.secundario, lineHeight: 22 }}>Os registros são separados por usuário. Cada conta acessa somente seus próprios serviços.</Text>
      </View>
      <View style={estilo.card}>
        <Text style={{ color: cor.azul, fontSize: 17, fontWeight: '800' }}>Sobre o Oficina 360</Text>
        <Text style={{ color: cor.secundario, lineHeight: 22 }}>Aplicativo acadêmico criado com React Native, Expo Router, Firebase Authentication e Cloud Firestore. Use somente dados fictícios.</Text>
      </View>
      <TouchableOpacity style={[estilo.botao, { backgroundColor: cor.vermelho }]} disabled={saindo} onPress={sair}>
        {saindo ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>Sair da conta</Text>}
      </TouchableOpacity>
    </View>
  </SafeAreaView>;
}
