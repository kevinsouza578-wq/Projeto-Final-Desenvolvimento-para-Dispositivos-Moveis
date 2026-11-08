import { cor, estilo } from '@/constants/oficina';
import { adicionarNota, mudarStatus, obterHistorico, obterOrdem } from '@/services/ordens';
import { STATUS, STATUS_ROTULO, type Historico, type Ordem, type StatusOrdem } from '@/types/ordem';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function DetalhesOrdem() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ordem, setOrdem] = useState<Ordem | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [nota, setNota] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const atualizar = useCallback(async () => {
    if (!id) return;
    try {
      const [registro, eventos] = await Promise.all([obterOrdem(id), obterHistorico(id)]);
      setOrdem(registro);
      setHistorico(eventos);
    } catch { Toast.show({ type: 'error', text1: 'Não foi possível carregar os detalhes.' }); }
    finally { setCarregando(false); }
  }, [id]);
  useFocusEffect(useCallback(() => { void atualizar(); }, [atualizar]));

  async function alterarStatus(status: StatusOrdem) {
    if (!ordem || salvando || ordem.status === status) return;
    setSalvando(true);
    try {
      await mudarStatus(ordem, status);
      await atualizar();
      Toast.show({ type: 'success', text1: 'Status atualizado!' });
    } catch { Toast.show({ type: 'error', text1: 'Erro ao atualizar o status.' }); }
    finally { setSalvando(false); }
  }

  async function registrarNota() {
    if (!ordem || salvando) return;
    if (!nota.trim()) return Toast.show({ type: 'error', text1: 'Escreva uma anotação.' });
    setSalvando(true);
    try {
      await adicionarNota(ordem, nota);
      setNota('');
      await atualizar();
      Toast.show({ type: 'success', text1: 'Anotação registrada!' });
    } catch { Toast.show({ type: 'error', text1: 'Não foi possível registrar a anotação.' }); }
    finally { setSalvando(false); }
  }

  if (carregando) return <ActivityIndicator style={{ flex: 1 }} color={cor.azul} />;
  if (!ordem) return <View style={estilo.conteudo}><Text>Serviço não encontrado.</Text></View>;
  return <ScrollView style={estilo.pagina} contentContainerStyle={estilo.conteudo} keyboardShouldPersistTaps="handled">
    <Text style={estilo.titulo}>{ordem.servico}</Text>
    <Text style={estilo.subtitulo}>Ordem de serviço de {ordem.cliente}</Text>
    <View style={estilo.card}>
      <Text style={{ color: cor.texto, lineHeight: 22 }}>{ordem.descricao}</Text>
      <Text style={{ color: cor.secundario }}>Prazo: {ordem.prazo}</Text>
      <Text style={{ color: cor.azul, fontWeight: '800', fontSize: 18 }}>Estimativa: R$ {ordem.valor.toFixed(2).replace('.', ',')}</Text>
      <TouchableOpacity style={estilo.botaoSecundario} onPress={() => router.push({ pathname: '/editar/[id]', params: { id: ordem.id } })}><Text style={estilo.botaoSecundarioTexto}>Editar os dados</Text></TouchableOpacity>
    </View>
    <Text style={{ color: cor.azul, fontSize: 19, fontWeight: '800', marginVertical: 12 }}>Atualizar status</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
      {STATUS.map((status) => <TouchableOpacity key={status} disabled={salvando} onPress={() => alterarStatus(status)} style={{ borderRadius: 10, padding: 12, backgroundColor: ordem.status === status ? cor.verde : '#E4EBF2' }}>
        <Text style={{ fontWeight: '800', color: ordem.status === status ? 'white' : cor.texto }}>{STATUS_ROTULO[status]}</Text>
      </TouchableOpacity>)}
    </View>
    <Text style={{ color: cor.azul, fontSize: 19, fontWeight: '800', marginVertical: 12 }}>Histórico do serviço</Text>
    <View style={estilo.card}>
      <Text style={estilo.label}>Adicionar observação</Text>
      <TextInput style={[estilo.input, { minHeight: 85, textAlignVertical: 'top', marginBottom: 0 }]} multiline value={nota} onChangeText={setNota} placeholder="Ex.: Armação pronta, aguardando material..." />
      <TouchableOpacity style={estilo.botao} onPress={registrarNota} disabled={salvando}><Text style={estilo.botaoTexto}>Registrar no histórico</Text></TouchableOpacity>
    </View>
    {historico.length === 0 ? <Text style={{ color: cor.secundario }}>Sem movimentações registradas.</Text> :
      historico.map((evento) => <View key={evento.id} style={[estilo.card, { borderLeftWidth: 4, borderLeftColor: cor.destaque }]}>
        <Text style={{ color: cor.texto, fontWeight: '800' }}>{evento.descricao}</Text>
        <Text style={{ color: cor.secundario, fontSize: 12 }}>
          {STATUS_ROTULO[evento.status]} · {evento.criadoEm?.toDate().toLocaleString('pt-BR') ?? 'Agora'}
        </Text>
      </View>)}
  </ScrollView>;
}
