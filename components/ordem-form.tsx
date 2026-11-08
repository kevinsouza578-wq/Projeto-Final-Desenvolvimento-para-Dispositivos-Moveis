import { cor, estilo } from '@/constants/oficina';
import { alterarOrdem, criarOrdem, obterOrdem } from '@/services/ordens';
import { STATUS, STATUS_ROTULO, type DadosOrdem, type StatusOrdem } from '@/types/ordem';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

function dataValida(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(valor + 'T12:00:00Z');
  return !Number.isNaN(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

export default function FormularioOrdem({ id }: { id?: string }) {
  const [cliente, setCliente] = useState('');
  const [servico, setServico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [valor, setValor] = useState('');
  const [status, setStatus] = useState<StatusOrdem>('recebido');
  const [carregando, setCarregando] = useState(!!id);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!id) return;
    let ativo = true;
    obterOrdem(id).then((ordem) => {
      if (!ativo) return;
      setCliente(ordem.cliente); setServico(ordem.servico); setDescricao(ordem.descricao);
      setPrazo(ordem.prazo); setValor(String(ordem.valor)); setStatus(ordem.status);
    }).catch(() => {
      Toast.show({ type: 'error', text1: 'Serviço não encontrado.' });
      router.back();
    }).finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; };
  }, [id]);

  async function salvar() {
    const valorNumero = Number(valor.replace(',', '.'));
    if (!cliente.trim() || !servico.trim() || !descricao.trim() || !dataValida(prazo) || !valor.trim() || !Number.isFinite(valorNumero) || valorNumero < 0)
      return Toast.show({ type: 'error', text1: 'Confira os campos', text2: 'Preencha todos os campos; prazo AAAA-MM-DD.' });
    const dados: DadosOrdem = {
      cliente: cliente.trim(), servico: servico.trim(), descricao: descricao.trim(),
      prazo, valor: valorNumero, status,
    };
    setSalvando(true);
    try {
      if (id) { await alterarOrdem(id, dados); router.back(); }
      else {
        await criarOrdem(dados);
        setCliente(''); setServico(''); setDescricao(''); setPrazo(''); setValor(''); setStatus('recebido');
        router.replace('/(tabs)/ordens');
      }
      Toast.show({ type: 'success', text1: id ? 'Serviço atualizado!' : 'Serviço cadastrado!' });
    } catch { Toast.show({ type: 'error', text1: 'Não foi possível salvar', text2: 'Confira a conexão e as permissões.' }); }
    finally { setSalvando(false); }
  }

  if (carregando) return <ActivityIndicator style={{ flex: 1 }} color={cor.azul} />;
  return <ScrollView style={estilo.pagina} contentContainerStyle={estilo.conteudo} keyboardShouldPersistTaps="handled">
    <Text style={estilo.titulo}>{id ? 'Editar serviço' : 'Nova ordem de serviço'}</Text>
    <Text style={estilo.subtitulo}>Use somente nomes fictícios para apresentar o projeto.</Text>
    <Text style={estilo.label}>Cliente / referência</Text>
    <TextInput style={estilo.input} value={cliente} onChangeText={setCliente} placeholder="Ex.: Condomínio Ipê (fictício)" />
    <Text style={estilo.label}>Tipo de serviço</Text>
    <TextInput style={estilo.input} value={servico} onChangeText={setServico} placeholder="Ex.: Reforma de cadeira" />
    <Text style={estilo.label}>Descrição</Text>
    <TextInput style={[estilo.input, { minHeight: 92, textAlignVertical: 'top' }]} multiline value={descricao} onChangeText={setDescricao} placeholder="O que precisa ser feito?" />
    <Text style={estilo.label}>Prazo (AAAA-MM-DD)</Text>
    <TextInput style={estilo.input} value={prazo} onChangeText={setPrazo} placeholder="2026-11-15" keyboardType="numbers-and-punctuation" />
    <Text style={estilo.label}>Valor estimado (R$)</Text>
    <TextInput style={estilo.input} value={valor} onChangeText={setValor} placeholder="250,00" keyboardType="decimal-pad" />
    <Text style={estilo.label}>Status</Text>
    <View style={{ flexDirection: 'row', gap: 7, marginBottom: 19, flexWrap: 'wrap' }}>
      {STATUS.map((opcao) => <TouchableOpacity key={opcao} onPress={() => setStatus(opcao)} style={{ borderRadius: 10, padding: 10, backgroundColor: status === opcao ? cor.azul : '#E4EBF2' }}>
        <Text style={{ color: status === opcao ? 'white' : cor.texto, fontWeight: '700' }}>{STATUS_ROTULO[opcao]}</Text>
      </TouchableOpacity>)}
    </View>
    <TouchableOpacity style={estilo.botao} disabled={salvando} onPress={salvar}>
      {salvando ? <ActivityIndicator color="white" /> : <Text style={estilo.botaoTexto}>{id ? 'Salvar alterações' : 'Cadastrar serviço'}</Text>}
    </TouchableOpacity>
  </ScrollView>;
}
