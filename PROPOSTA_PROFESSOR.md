# Proposta do Projeto Final — Oficina 360

**Curso:** ADS · Desenvolvimento para Dispositivos Móveis · 2º semestre de 2026  
**Tema escolhido:** Tema livre, sujeito à aprovação do professor.  
**Nome:** Oficina 360 — Gestão simples de ordens de serviço.

**Problema e público:** oficinas de manutenção e pequenas empresas de reforma anotam serviços em papéis ou mensagens, dificultando o controle de prazos e o acompanhamento da execução. O app permite que o responsável organize seus trabalhos pelo celular, usando dados de demonstração fictícios.

**Funcionalidades:** cadastro de conta, login/logout, criação e alteração de ordens de serviço (cliente fictício, tipo, descrição, prazo, valor estimado e status), consulta e exclusão com confirmação, busca, filtro de status, painel com contadores e histórico de observações/mudanças de etapa.

**Modelo de dados (Firestore):**

- Coleção `ordens`: `cliente: string`, `servico: string`, `descricao: string`, `prazo: string (AAAA-MM-DD)`, `valor: number`, `status: string`, `ownerUid: string`, `criadoEm: timestamp`, `atualizadoEm: timestamp`.
- Subcoleção `ordens/{id}/historico`: `descricao: string`, `status: string`, `ownerUid: string`, `criadoEm: timestamp`.
- Vínculo: cada histórico pertence a uma ordem. As regras de segurança restringem os dados ao usuário autenticado que criou a ordem.

**Telas (8):** login, cadastro de conta, painel inicial, lista de serviços, nova OS, minha conta, detalhes/histórico e edição de OS. A área principal utiliza quatro abas: Painel, Serviços, Nova OS e Conta.

**Diferenciais escolhidos do cardápio:** (1) subcoleção relacionada de histórico, (2) dados por usuário com segurança, (3) busca e filtros, (4) painel de resumo e (5) mudança de status com um toque.

**Identidade visual:** azul-petróleo para organização e confiança, laranja para ações e verde para finalização. Layout responsivo com cartões e botões grandes para interação por toque.

**Grupo (nomes a completar antes da entrega):**

1. Kevin — estrutura Expo Router, integração e documentação.
2. Integrante 2 — autenticação e testes de login/logout.
3. Integrante 3 — CRUD das ordens de serviço e validações.
4. Integrante 4 — histórico, painel e apresentação visual.

**Pedido:** aprovação deste tema livre para seguir as atividades previstas na rubrica.
