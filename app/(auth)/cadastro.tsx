import { cor, estilo } from '@/constants/oficina';
import { auth } from '@/firebase';
import { Link } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [aguardando, setAguardando] = useState(false);
  async function registrar() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || senha.length < 6 || senha !== confirmacao)
      return Toast.show({ type: 'error', text1: 'Confira os dados', text2: 'E-mail válido, senha 6+ e confirmação igual.' });
    setAguardando(true);
    try { await createUserWithEmailAndPassword(auth, email.trim(), senha); }
    catch { Toast.show({ type: 'error', text1: 'Não foi possível criar conta', text2: 'E-mail já cadastrado ou inválido.' }); }
    finally { setAguardando(false); }
  }
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cor.fundo }}>
    <Text style={estilo.titulo}>Criar conta</Text>
    <Text style={estilo.subtitulo}>Acesse o Oficina 360 com um e-mail de teste.</Text>
    <Text style={estilo.label}>E-mail</Text>
    <TextInput style={estilo.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="usuario@exemplo.com" />
    <Text style={estilo.label}>Senha</Text>
    <TextInput style={estilo.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Mínimo 6 caracteres" />
    <Text style={estilo.label}>Confirmar senha</Text>
    <TextInput style={estilo.input} value={confirmacao} onChangeText={setConfirmacao} secureTextEntry placeholder="Repita a senha" />
    <TouchableOpacity style={estilo.botao} disabled={aguardando} onPress={registrar}>{aguardando ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>Cadastrar conta</Text>}</TouchableOpacity>
    <Link href="/(auth)" style={{ alignSelf: 'center', marginTop: 23, color: cor.azul, fontWeight: '800' }}>Já tenho uma conta</Link>
  </KeyboardAvoidingView>;
}
