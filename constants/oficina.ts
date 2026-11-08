import { StyleSheet } from 'react-native';

export const cor = {
  fundo: '#F3F6FA', azul: '#152F4E', azulClaro: '#284D73',
  destaque: '#F4A641', verde: '#18866A', vermelho: '#BE4651',
  texto: '#243C56', secundario: '#677C90', linha: '#D9E3EE',
};
export const estilo = StyleSheet.create({
  pagina: { flex: 1, backgroundColor: cor.fundo },
  conteudo: { padding: 19, paddingBottom: 35 },
  titulo: { color: cor.azul, fontSize: 27, fontWeight: '800', marginBottom: 5 },
  subtitulo: { color: cor.secundario, fontSize: 14, lineHeight: 21, marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 17, borderRadius: 17, marginBottom: 12, gap: 10, borderWidth: 1, borderColor: '#E6ECF4' },
  label: { color: cor.texto, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: 'white', borderColor: cor.linha, borderWidth: 1, padding: 13, borderRadius: 10, color: cor.texto, marginBottom: 15, minHeight: 50 },
  botao: { backgroundColor: cor.azul, paddingVertical: 15, paddingHorizontal: 16, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  botaoTexto: { fontWeight: '800', color: 'white' },
  botaoSecundario: { backgroundColor: '#E4EDF7', padding: 13, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  botaoSecundarioTexto: { color: cor.azul, fontWeight: '800' },
  tag: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', backgroundColor: '#E8F0FB', color: cor.azulClaro, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
});
