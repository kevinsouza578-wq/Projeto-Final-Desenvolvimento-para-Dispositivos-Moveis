import { cor, estilo } from '@/constants/oficina';
import { auth } from '@/firebase';
import { Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  async function entrar() {
    if (!email.trim() || !senha) return Toast.show({ type: 'error', text1: 'Informe e-mail e senha.' });
    setEntrando(true);
    try { await signInWithEmailAndPassword(auth, email.trim(), senha); }
    catch { Toast.show({ type: 'error', text1: 'Acesso não autorizado', text2: 'Confira e-mail e senha.' }); }
    finally { setEntrando(false); }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cor.azul }}>
    <View style={{ alignItems: 'center', marginBottom: 35 }}>
      <Text style={{ color: cor.destaque, fontWeight: '800', letterSpacing: 4 }}>OFICINA</Text>
      <Text style={{ fontSize: 48, fontWeight: '900', color: 'white' }}>360</Text>
      <Text style={{ color: '#C3D6E9', textAlign: 'center' }}>Serviços organizados. Prazos sob controle.</Text>
    </View>
    <View style={{ backgroundColor: 'white', borderRadius: 22, padding: 22 }}>
      <Text style={[estilo.titulo, { fontSize: 23, marginBottom: 19 }]}>Entrar na conta</Text>
      <Text style={estilo.label}>E-mail</Text>
      <TextInput style={estilo.input} autoCapitalize="none" keyboardType="email-address" placeholder="usuario@exemplo.com" value={email} onChangeText={setEmail} />
      <Text style={estilo.label}>Senha</Text>
      <TextInput style={estilo.input} secureTextEntry placeholder="Sua senha" value={senha} onChangeText={setSenha} />
      <TouchableOpacity style={estilo.botao} disabled={entrando} onPress={entrar}>{entrando ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>Entrar</Text>}</TouchableOpacity>
      <Link href="/(auth)/cadastro" style={{ textAlign: 'center', marginTop: 22, color: cor.azulClaro, fontWeight: '800' }}>Criar nova conta</Link>
    </View>
  </KeyboardAvoidingView>;
}
