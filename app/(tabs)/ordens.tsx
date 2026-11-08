import { cor, estilo } from '@/constants/oficina';
import { useOrdens } from '@/hooks/use-ordens';
import { excluirOrdem } from '@/services/ordens';
import { STATUS, STATUS_ROTULO, type Ordem, type StatusOrdem } from '@/types/ordem';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function ListaServicos() {
  const { ordens, carregando, atualizar } = useOrdens();
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<StatusOrdem | 'todos'>('todos');
  const filtradas = useMemo(() => ordens.filter((o) => {
    const pesquisa = (o.cliente + ' ' + o.servico + ' ' + o.descricao).toLocaleLowerCase('pt-BR');
    return pesquisa.includes(busca.trim().toLocaleLowerCase('pt-BR')) && (filtro === 'todos' || o.status === filtro);
  }), [ordens, busca, filtro]);

  function confirmarExclusao(ordem: Ordem) {
    const mensagem = `Deseja excluir a ordem de ${ordem.cliente} e seu histórico?`;
    async function excluir() {
      try {
        await excluirOrdem(ordem);
        Toast.show({ type: 'success', text1: 'Serviço excluído.' });
        await atualizar();
      } catch {
        Toast.show({ type: 'error', text1: 'Não foi possível excluir.' });
      }
    }
    if (Platform.OS === 'web') {
      if (window.confirm(mensagem)) void excluir();
      return;
    }
    Alert.alert('Excluir serviço', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  }

  return <View style={estilo.pagina}>
    <View style={{ paddingHorizontal: 19, paddingTop: 19 }}>
      <Text style={estilo.titulo}>Ordens de serviço</Text>
      <Text style={estilo.subtitulo}>Busque, filtre e gerencie seus trabalhos.</Text>
      <TextInput style={estilo.input} placeholder="Buscar cliente ou serviço..." value={busca} onChangeText={setBusca} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 15 }}>
        {(['todos', ...STATUS] as const).map((status) => <TouchableOpacity key={status} onPress={() => setFiltro(status)} style={{ backgroundColor: filtro === status ? cor.azul : '#E4EBF2', borderRadius: 10, padding: 9 }}>
          <Text style={{ fontWeight: '700', fontSize: 12, color: filtro === status ? 'white' : cor.texto }}>{status === 'todos' ? 'Todos' : STATUS_ROTULO[status]}</Text>
        </TouchableOpacity>)}
      </View>
    </View>
    {carregando ? <ActivityIndicator size="large" color={cor.azul} /> :
      <FlatList data={filtradas} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingHorizontal: 19, paddingBottom: 35 }}
        ListEmptyComponent={<View style={estilo.card}><Text style={{ color: cor.secundario }}>Nenhum serviço encontrado.</Text></View>}
        renderItem={({ item }) => <View style={estilo.card}>
          <Text style={{ color: cor.azul, fontSize: 18, fontWeight: '800' }}>{item.servico}</Text>
          <Text style={{ color: cor.secundario }}>{item.cliente}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <Text style={estilo.tag}>{STATUS_ROTULO[item.status]}</Text>
            <Text style={{ color: cor.secundario }}>Prazo: {item.prazo}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[estilo.botao, { flex: 1 }]} onPress={() => router.push({ pathname: '/ordem/[id]', params: { id: item.id } })}><Text style={estilo.botaoTexto}>Detalhes</Text></TouchableOpacity>
            <TouchableOpacity style={[estilo.botaoSecundario, { flex: 1 }]} onPress={() => router.push({ pathname: '/editar/[id]', params: { id: item.id } })}><Text style={estilo.botaoSecundarioTexto}>Editar</Text></TouchableOpacity>
            <TouchableOpacity accessibilityLabel="Excluir serviço" style={[estilo.botaoSecundario, { backgroundColor: '#FBE6E7' }]} onPress={() => confirmarExclusao(item)}><Text style={{ color: cor.vermelho, fontWeight: '800' }}>Excluir</Text></TouchableOpacity>
          </View>
        </View>} />}
  </View>;
}
