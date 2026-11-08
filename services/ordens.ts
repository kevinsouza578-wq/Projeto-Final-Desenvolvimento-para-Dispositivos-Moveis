import { auth, db } from '@/firebase';
import type { DadosOrdem, Historico, Ordem, StatusOrdem } from '@/types/ordem';
import { collection, doc, getDoc, getDocs, serverTimestamp, where, query, writeBatch } from 'firebase/firestore';

function usuarioAtual() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Entre na conta para continuar.');
  return uid;
}

// Cada serviço pertence ao usuário logado; o primeiro registro de histórico
// é criado na mesma operação para não deixar dados incompletos.
export async function criarOrdem(dados: DadosOrdem) {
  const ownerUid = usuarioAtual();
  const referencia = doc(collection(db, 'ordens'));
  const evento = doc(collection(db, 'ordens', referencia.id, 'historico'));
  const lote = writeBatch(db);
  lote.set(referencia, { ...dados, ownerUid, criadoEm: serverTimestamp(), atualizadoEm: serverTimestamp() });
  lote.set(evento, { ownerUid, status: dados.status, descricao: 'Serviço cadastrado', criadoEm: serverTimestamp() });
  await lote.commit();
  return referencia.id;
}

export async function obterOrdem(id: string): Promise<Ordem> {
  usuarioAtual();
  const snap = await getDoc(doc(db, 'ordens', id));
  if (!snap.exists()) throw new Error('Serviço não encontrado.');
  return { id: snap.id, ...snap.data() } as Ordem;
}

export async function alterarOrdem(id: string, dados: DadosOrdem) {
  const original = await obterOrdem(id);
  if (original.ownerUid !== usuarioAtual()) throw new Error('Sem permissão.');
  const lote = writeBatch(db);
  lote.update(doc(db, 'ordens', id), { ...dados, atualizadoEm: serverTimestamp() });
  lote.set(doc(collection(db, 'ordens', id, 'historico')), {
    ownerUid: usuarioAtual(), status: dados.status,
    descricao: 'Dados do serviço atualizados', criadoEm: serverTimestamp(),
  });
  await lote.commit();
}

export async function mudarStatus(ordem: Ordem, status: StatusOrdem) {
  if (ordem.ownerUid !== usuarioAtual()) throw new Error('Sem permissão.');
  const lote = writeBatch(db);
  lote.update(doc(db, 'ordens', ordem.id), { status, atualizadoEm: serverTimestamp() });
  lote.set(doc(collection(db, 'ordens', ordem.id, 'historico')), {
    ownerUid: usuarioAtual(), status, descricao: 'Status alterado', criadoEm: serverTimestamp(),
  });
  await lote.commit();
}

export async function adicionarNota(ordem: Ordem, descricao: string) {
  if (ordem.ownerUid !== usuarioAtual()) throw new Error('Sem permissão.');
  const lote = writeBatch(db);
  lote.set(doc(collection(db, 'ordens', ordem.id, 'historico')), {
    ownerUid: usuarioAtual(), status: ordem.status, descricao: descricao.trim(), criadoEm: serverTimestamp(),
  });
  lote.update(doc(db, 'ordens', ordem.id), { atualizadoEm: serverTimestamp() });
  await lote.commit();
}

export async function obterHistorico(id: string): Promise<Historico[]> {
  usuarioAtual();
  const snap = await getDocs(collection(db, 'ordens', id, 'historico'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Historico)
    .sort((a, b) => (b.criadoEm?.seconds ?? 0) - (a.criadoEm?.seconds ?? 0));
}

export async function excluirOrdem(ordem: Ordem) {
  if (ordem.ownerUid !== usuarioAtual()) throw new Error('Sem permissão.');
  // Firestore não apaga subcoleções automaticamente.
  const historico = await getDocs(collection(db, 'ordens', ordem.id, 'historico'));
  if (historico.size > 400) throw new Error('Histórico extenso: exclua em lotes menores.');
  const lote = writeBatch(db);
  historico.docs.forEach((d) => lote.delete(d.ref));
  lote.delete(doc(db, 'ordens', ordem.id));
  await lote.commit();
}

export async function listarOrdens(): Promise<Ordem[]> {
  const uid = usuarioAtual();
  const snap = await getDocs(query(collection(db, 'ordens'), where('ownerUid', '==', uid)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Ordem)
    .sort((a, b) => (b.criadoEm?.seconds ?? 0) - (a.criadoEm?.seconds ?? 0));
}
