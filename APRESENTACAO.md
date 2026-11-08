# Roteiro de apresentação — até 15 minutos, quatro integrantes

## Slides sugeridos (10 a 12)

1. **Capa** (0:40) — Oficina 360, integrantes, ADS/UniSENAI.
2. **Problema** (1:00) — serviços anotados de forma dispersa, prazos difíceis de acompanhar.
3. **Solução e público** (1:00) — ordens digitais para pequenas oficinas, com dados fictícios.
4. **Ferramentas** (1:20) — React Native (interface), Expo (execução e testes), Expo Router (telas), Firebase (Auth e Firestore).
5. **Mapa de telas** (1:00) — login/cadastro → abas: painel, serviços, nova OS, conta → detalhes/edição.
6. **Modelo de dados** (1:10) — `ordens` e subcoleção `historico` relacionadas; proteção por `ownerUid`.
7. **Demonstração 1** (1:40) — login, criação, busca e lista.
8. **Demonstração 2** (1:40) — edição, mudança de status, anotação e exclusão.
9. **Diferenciais** (1:00) — histórico, filtro, contadores, status com toque e isolamento de contas.
10. **Desafios técnicos** (1:15) — rotas protegidas; estado/loading; consultas e segurança; corrigir erros de validação.
11. **Resultados e aprendizados** (0:55) — ciclo CRUD completo e boas práticas mobile.
12. **Conclusão e perguntas** (1:00) — limitações, próximos passos e perguntas.

## Divisão para o grupo

| Quem | Tempo sugerido | Explicação e demonstração |
| --- | --- | --- |
| Kevin | 3:30 | Introdução, problema, solução e navegação pelo app |
| Integrante 2 | 3:30 | Firebase Authentication, cadastro e sessão |
| Integrante 3 | 3:30 | Firestore, formulário, CRUD e validações |
| Integrante 4 | 3:30 | Histórico, filtros, painel, segurança e conclusão |

**Ensaio:** reserve até um minuto de margem para atrasos. Cada colega precisa saber explicar o conceito de coleção, documento, `useState`, `FlatList`, `async/await` e `onAuthStateChanged`.

## Plano de contingência

- Fazer antes um vídeo curto de reserva com o fluxo completo.
- Cadastrar cinco exemplos fictícios para a demonstração.
- Não depender de Wi-Fi exclusivo da faculdade; testar a rede do celular.
- Deixar o aplicativo instalado/aberto e manter os slides em PDF offline.
- Não mostrar o arquivo `.env` nem credenciais.
