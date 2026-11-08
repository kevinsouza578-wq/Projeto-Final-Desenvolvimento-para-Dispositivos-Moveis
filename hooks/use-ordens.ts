import { listarOrdens } from '@/services/ordens';
import type { Ordem } from '@/types/ordem';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import Toast from 'react-native-toast-message';

// Hook próprio exigido na atividade: consulta o Firestore e recarrega ao
// retornar para a aba. Não faz consultas a cada renderização.
export function useOrdens() {
  const [ordens, setOrdens] = useState<Ordem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const atualizar = useCallback(async () => {
    setCarregando(true);
    try { setOrdens(await listarOrdens()); }
    catch { Toast.show({ type: 'error', text1: 'Falha ao carregar serviços', text2: 'Verifique a internet e as regras.' }); }
    finally { setCarregando(false); }
  }, []);
  useFocusEffect(useCallback(() => { void atualizar(); }, [atualizar]));
  return { ordens, carregando, atualizar };
}
