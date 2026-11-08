import type { Timestamp } from 'firebase/firestore';

export const STATUS = ['recebido', 'em_andamento', 'finalizado'] as const;
export type StatusOrdem = (typeof STATUS)[number];
export const STATUS_ROTULO: Record<StatusOrdem, string> = {
  recebido: 'Recebido', em_andamento: 'Em andamento', finalizado: 'Finalizado',
};
export type DadosOrdem = {
  cliente: string;
  servico: string;
  descricao: string;
  prazo: string;
  valor: number;
  status: StatusOrdem;
};
export type Ordem = DadosOrdem & {
  id: string;
  ownerUid: string;
  criadoEm?: Timestamp;
  atualizadoEm?: Timestamp;
};
export type Historico = {
  id: string;
  descricao: string;
  status: StatusOrdem;
  criadoEm?: Timestamp;
  ownerUid: string;
};
