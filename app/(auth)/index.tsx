import { cor, estilo } from '@/constants/oficina';
import { auth } from '@/firebase';
import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [erroMensagem, setErroMensagem] = useState('');

  async function entrar() {
    if (entrando) return;
    setErroMensagem('');
    if (!email.trim() || !senha) {
      setErroMensagem('Informe e-mail e senha.');
      return Toast.show({ type: 'error', text1: 'Informe e-mail e senha.' });
    }
    setEntrando(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), senha);
      router.replace('/(tabs)');
    } catch (erro: any) {
      console.error('Erro de login:', erro);
      let mensagem = erro?.message || 'Confira e-mail e senha.';
      if (erro?.code === 'auth/operation-not-allowed') {
        mensagem = 'O provedor E-mail/Senha não está ativado no Firebase Console!';
      } else if (erro?.code === 'auth/invalid-credential' || erro?.code === 'auth/wrong-password' || erro?.code === 'auth/user-not-found') {
        mensagem = 'E-mail ou senha incorretos.';
      } else if (erro?.code === 'auth/invalid-api-key') {
        mensagem = 'Chave do Firebase inválida no .env.';
      }
      setErroMensagem(mensagem);
      Toast.show({ type: 'error', text1: 'Erro de Login', text2: mensagem });
    } finally {
      setEntrando(false);
    }
  }

  const handleKeyDown = (e: any) => {
    if (e?.key === 'Enter') {
      e?.preventDefault?.();
      void entrar();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cor.azul }}
    >
      <View style={{ alignItems: 'center', marginBottom: 35 }}>
        <Text style={{ color: cor.destaque, fontWeight: '800', letterSpacing: 4 }}>OFICINA</Text>
        <Text style={{ fontSize: 48, fontWeight: '900', color: 'white' }}>360</Text>
        <Text style={{ color: '#C3D6E9', textAlign: 'center' }}>Serviços organizados. Prazos sob controle.</Text>
      </View>
      <View
        // @ts-ignore - ARIA role no web
        role="form"
        // @ts-ignore - prop de evento DOM no web
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: 'white', borderRadius: 22, padding: 22 }}
      >
        <Text style={[estilo.titulo, { fontSize: 23, marginBottom: 19 }]}>Entrar na conta</Text>
        <Text style={estilo.label}>E-mail</Text>
        <TextInput
          style={estilo.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="usuario@exemplo.com"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
          onSubmitEditing={entrar}
        />
        <Text style={estilo.label}>Senha</Text>
        <TextInput
          style={estilo.input}
          secureTextEntry
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          returnKeyType="go"
          onSubmitEditing={entrar}
        />
        <Pressable
          accessibilityRole="button"
          role="button"
          disabled={entrando}
          onPress={entrar}
          style={({ pressed }) => [
            estilo.botao,
            Platform.OS === 'web' && ({ cursor: 'pointer', userSelect: 'none' } as any),
            pressed && { opacity: 0.8 },
          ]}
        >
          {entrando ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>Entrar</Text>}
        </Pressable>
        {!!erroMensagem && (
          <View style={{ backgroundColor: '#FDE8E8', padding: 12, borderRadius: 8, marginTop: 15, borderWidth: 1, borderColor: '#F8B4B4' }}>
            <Text style={{ color: '#9B1C1C', fontWeight: '700', textAlign: 'center', fontSize: 13 }}>{erroMensagem}</Text>
          </View>
        )}
        <Link href="/(auth)/cadastro" style={{ textAlign: 'center', marginTop: 22, color: cor.azulClaro, fontWeight: '800' }}>
          Criar nova conta
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
