import { cor, estilo } from '@/constants/oficina';
import { auth } from '@/firebase';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [aguardando, setAguardando] = useState(false);
  const [erroMensagem, setErroMensagem] = useState('');

  async function registrar() {
    if (aguardando) return;
    setErroMensagem('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || senha.length < 6 || senha !== confirmacao) {
      const msg = 'E-mail válido, senha com 6+ caracteres e confirmação igual.';
      setErroMensagem(msg);
      return Toast.show({ type: 'error', text1: 'Confira os dados', text2: msg });
    }
    setAguardando(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), senha);
      router.replace('/(tabs)');
    } catch (erro: any) {
      console.error('Erro de cadastro:', erro);
      let mensagem = 'E-mail já cadastrado ou inválido.';
      if (erro?.code === 'auth/operation-not-allowed') {
        mensagem = 'O provedor E-mail/Senha não está ativado no Firebase Console!';
      } else if (erro?.code === 'auth/email-already-in-use') {
        mensagem = 'Este e-mail já está cadastrado. Tente entrar na sua conta.';
      } else if (erro?.code === 'auth/weak-password') {
        mensagem = 'Senha muito fraca. Digite pelo menos 6 caracteres.';
      } else if (erro?.code === 'auth/invalid-email') {
        mensagem = 'Formato de e-mail inválido.';
      }
      setErroMensagem(mensagem);
      Toast.show({ type: 'error', text1: 'Não foi possível criar conta', text2: mensagem });
    } finally {
      setAguardando(false);
    }
  }

  const handleKeyDown = (e: any) => {
    if (e?.key === 'Enter') {
      e?.preventDefault?.();
      void registrar();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: cor.fundo }}
    >
      <View
        // @ts-ignore - ARIA role no web
        role="form"
        // @ts-ignore - prop de evento DOM no web
        onKeyDown={handleKeyDown}
        style={{ backgroundColor: 'white', borderRadius: 22, padding: 22 }}
      >
        <Text style={estilo.titulo}>Criar conta</Text>
        <Text style={estilo.subtitulo}>Acesse o Oficina 360 com um e-mail de teste.</Text>
        <Text style={estilo.label}>E-mail</Text>
        <TextInput
          style={estilo.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="usuario@exemplo.com"
          returnKeyType="next"
        />
        <Text style={estilo.label}>Senha</Text>
        <TextInput
          style={estilo.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
          returnKeyType="next"
        />
        <Text style={estilo.label}>Confirmar senha</Text>
        <TextInput
          style={estilo.input}
          value={confirmacao}
          onChangeText={setConfirmacao}
          secureTextEntry
          placeholder="Repita a senha"
          returnKeyType="go"
          onSubmitEditing={registrar}
        />
        <Pressable
          accessibilityRole="button"
          role="button"
          disabled={aguardando}
          onPress={registrar}
          style={({ pressed }) => [
            estilo.botao,
            Platform.OS === 'web' && ({ cursor: 'pointer', userSelect: 'none' } as any),
            pressed && { opacity: 0.8 },
          ]}
        >
          {aguardando ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>Cadastrar conta</Text>}
        </Pressable>
        {!!erroMensagem && (
          <View style={{ backgroundColor: '#FDE8E8', padding: 12, borderRadius: 8, marginTop: 15, borderWidth: 1, borderColor: '#F8B4B4' }}>
            <Text style={{ color: '#9B1C1C', fontWeight: '700', textAlign: 'center', fontSize: 13 }}>{erroMensagem}</Text>
          </View>
        )}
        <Link href="/(auth)" style={{ alignSelf: 'center', marginTop: 23, color: cor.azul, fontWeight: '800' }}>
          Já tenho uma conta
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}
