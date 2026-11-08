# Projeto Final Desenvolvimento para Dispositivos Móveis

Oficina 360 é um web app acadêmico para organizar ordens de serviço de uma pequena oficina. Construído em **Expo SDK 54 + React Native + TypeScript + Expo Router + Firebase Authentication + Cloud Firestore**.

O projeto adapta a arquitetura do repositório-modelo do professor, mas traz uma identidade própria e uma nova entidade de negócio.

## Pré-requisitos e execução

1. Node.js 20.19 ou superior.
2. Nesta pasta, execute `npm ci`.
3. Execute `npm run web` para abrir o app no navegador. O código usa a configuração Web pública do Firebase do grupo fornecida por Bruno. O arquivo `.env` é opcional para usar outro projeto.
4. Quem administra o Firebase deve conferir se as regras publicadas correspondem a `firestore.rules`.

**Importante:** as variáveis `EXPO_PUBLIC_` são incluídas no aplicativo e não devem armazenar segredos. O objeto de configuração Web do Firebase não é uma senha; a proteção depende das regras de segurança. Não salve contas reais, senhas ou dados sensíveis de clientes no repositório.

## Telas

| Rota | Função |
| --- | --- |
| `(auth)/index` | Login por e-mail/senha |
| `(auth)/cadastro` | Cadastro de conta |
| `(tabs)/index` | Painel com totais e próximos prazos |
| `(tabs)/ordens` | Busca, filtros, listagem e exclusão |
| `(tabs)/nova` | Criar ordem |
| `(tabs)/perfil` | Dados da conta e logout |
| `ordem/[id]` | Detalhes, anotação e mudança de status |
| `editar/[id]` | Alterar ordem existente |

## Firestore e diferenciais

- `ordens/{id}`: `cliente`, `servico`, `descricao`, `prazo` (AAAA-MM-DD), `valor` (**number**), `status`, `ownerUid`, `criadoEm`, `atualizadoEm`.
- `ordens/{id}/historico/{eventoId}`: `descricao`, `status`, `ownerUid`, `criadoEm`.
- Hook próprio `hooks/use-ordens.ts` obtém as ordens de quem está logado e recarrega ao focar a aba.
- CRUD com `writeBatch` para manter alterações e histórico sincronizados; exclusão de ordens também remove os eventos filhos (máximo 400 no exemplo acadêmico).
- Diferenciais: histórico em subcoleção, dados separados por usuário, filtro e busca, painel com indicadores e mudança de status com um toque.
- Segurança: regras Firestore exigem autenticação e vínculo com `ownerUid`.

## Fluxo da demonstração

1. Abrir sem sessão e cadastrar uma conta de teste.
2. Entrar e cadastrar cinco OS fictícias, com prazos e status diferentes.
3. Conferir contadores no Painel.
4. Buscar/filtrar serviço na lista.
5. Editar prazo ou valor, abrir detalhes, mudar status e adicionar anotação.
6. Excluir uma ordem mediante confirmação.
7. Sair e entrar em outra conta para mostrar a separação dos registros.

Para testar a sessão, recarregue a página depois do login. O painel deve reaparecer sem pedir a senha. Depois de sair, confira se o botão Voltar mantém a área de serviços protegida. Para testar a validação, tente salvar uma ordem com prazo inexistente ou valor negativo e confirme que ela não aparece na lista.

## Verificações locais

Execute `npm run typecheck` para conferir os tipos, `npm run lint` para revisar o código e `npx expo export --platform android` para gerar o bundle Android. Para esta entrega, valide o fluxo no navegador com `npm run web`.

## Testes e entregas pendentes

O aplicativo usa o Firebase do grupo. Antes da apresentação, testar no navegador e registrar capturas de tela, inclusive do console do Firebase. Não afirmar que o backend está conectado antes desse teste.

Documentação complementar: [PROPOSTA_PROFESSOR.md](PROPOSTA_PROFESSOR.md) e [APRESENTACAO.md](APRESENTACAO.md).

