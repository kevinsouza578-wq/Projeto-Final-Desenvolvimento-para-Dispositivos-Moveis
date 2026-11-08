import FormularioOrdem from '@/components/ordem-form';
import { useLocalSearchParams } from 'expo-router';
export default function Editar() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <FormularioOrdem id={id} />;
}
