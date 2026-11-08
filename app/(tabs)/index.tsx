import { cor, estilo } from '@/constants/oficina';
import { useOrdens } from '@/hooks/use-ordens';
import { STATUS_ROTULO, type Ordem } from '@/types/ordem';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Indicador({ valor, texto, corValor }: { valor: number; texto: string; corValor: string }) {
  return <View style={[estilo.card, { flex: 1, alignItems: 'center', minWidth: 95 }]}>
    <Text style={{ fontSize: 28, fontWeight: '900', color: corValor }}>{valor}</Text>
    <Text style={{ fontSize: 12, fontWeight: '700', color: cor.secundario, textAlign: 'center' }}>{texto}</Text>
  </View>;
}

export default function Painel() {
  const { ordens, carregando } = useOrdens();
  const abertos = ordens.filter((o) => o.status === 'recebido').length;
  const andamento = ordens.filter((o) => o.status === 'em_andamento').length;
  const finalizados = ordens.filter((o) => o.status === 'finalizado').length;
  const proximos = [...ordens].filter((o) => o.status !== 'finalizado').sort((a, b) => a.prazo.localeCompare(b.prazo)).slice(0, 3);
  return <SafeAreaView style={estilo.pagina}>
    <ScrollView contentContainerStyle={estilo.conteudo}>
      <View style={{ backgroundColor: cor.azul, borderRadius: 19, padding: 22, marginBottom: 21 }}>
        <Text style={{ color: cor.destaque, fontWeight: '800', letterSpacing: 2, fontSize: 12 }}>OFICINA 360</Text>
        <Text style={{ color: 'white', fontSize: 27, fontWeight: '900', marginTop: 10 }}>Painel de serviços</Text>
        <Text style={{ color: '#C4D8EA', marginTop: 8, lineHeight: 20 }}>Acompanhe suas ordens e os próximos prazos.</Text>
      </View>
      {carregando ? <ActivityIndicator color={cor.azul} /> : <>
        <Text style={{ color: cor.texto, fontSize: 18, fontWeight: '800', marginBottom: 12 }}>Resumo geral</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Indicador valor={abertos} texto="Recebidos" corValor={cor.destaque} />
          <Indicador valor={andamento} texto="Em andamento" corValor={cor.azulClaro} />
          <Indicador valor={finalizados} texto="Finalizados" corValor={cor.verde} />
        </View>
        <Text style={{ color: cor.texto, fontSize: 18, fontWeight: '800', marginVertical: 12 }}>Próximas entregas</Text>
        {proximos.length === 0 ? <View style={estilo.card}><Text style={{ color: cor.secundario }}>Sem serviços pendentes. Cadastre a primeira ordem!</Text></View>
          : proximos.map((ordem: Ordem) => <TouchableOpacity key={ordem.id} style={estilo.card} onPress={() => router.push({ pathname: '/ordem/[id]', params: { id: ordem.id } })}>
            <Text style={{ fontWeight: '800', color: cor.azul, fontSize: 16 }}>{ordem.servico}</Text>
            <Text style={{ color: cor.secundario }}>{ordem.cliente} · Prazo: {ordem.prazo}</Text>
            <Text style={estilo.tag}>{STATUS_ROTULO[ordem.status]}</Text>
          </TouchableOpacity>)}
      </>}
      <TouchableOpacity style={[estilo.botao, { marginTop: 12, flexDirection: 'row', gap: 8 }]} onPress={() => router.push('/(tabs)/nova')}>
        <Ionicons name="add" size={20} color="white" /><Text style={estilo.botaoTexto}>Nova ordem de serviço</Text>
      </TouchableOpacity>
    </ScrollView>
  </SafeAreaView>;
}
