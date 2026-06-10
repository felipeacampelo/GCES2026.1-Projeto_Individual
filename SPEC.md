# Fundação Transversal

Esta especificação define a primeira etapa do Projeto: modernizar a Aplicação Base para ambiente atual, remover bloqueios de compatibilidade e preparar a execução das Fases 1 a 4 sem perder cobertura planejada dos 10 critérios de avaliação.

## Objetivo

Colocar a Aplicação Base para executar em ambiente atual com backend e frontend compatíveis, dependências do servidor saneadas e documentação-base criada.

## Estado Inicial Observado

- O `README.md` define o Projeto como uma evolução do `mk.js`, com 10 critérios de avaliação.
- O servidor já tinha `express` e `socket.io` modernizados no manifesto, mas o código continuava usando APIs legadas incompatíveis.
- O backend falhava ao iniciar em Node atual por uso de `require('socket.io').listen(server)`.
- O frontend de rede ainda usava `io.connect()`.
- O `npm audit` do servidor reportava vulnerabilidades em `express` e dependências transitivas associadas.
- Não existia `CONTEXT.md` nem uma especificação dedicada para a fundação.

## Incompatibilidades Atuais

- Uso legado de `app.configure(...)` incompatível com `express@4`.
- Inicialização legada de Socket.IO incompatível com `socket.io@4`.
- Bug lógico em `GameCollection.createGame`, que verificava uma variável incorreta.
- Encerramento de sessão sem checagem defensiva do socket oponente.
- Lockfile e árvore instalada precisavam ser regenerados em estado consistente e seguro.

## Requisitos de Execução Compatível

- O servidor deve iniciar via `node server.js`.
- O backend deve servir a Aplicação Base em `http://localhost:55555`.
- A Aplicação Base deve abrir no navegador e entrar em um modo jogável básico.
- Dependências do servidor não podem manter as vulnerabilidades observadas no estado inicial.
- A fundação deve registrar a continuidade planejada das 10 fases do Projeto.

## Fora de Escopo desta Etapa

- Implementar Docker, Compose, Postgres, CI, testes automatizados novos, fuzzing, SonarCloud, Kubernetes, Terraform, CD ou HTTPS.
- Redesenhar o protocolo de jogo ou expandir funcionalidades do `mk.js`.

## Critérios de Aceite

- `npm install` do servidor conclui sem falha.
- `node server.js` sobe sem erro em Node atual.
- `http://localhost:55555` entrega a Aplicação Base.
- A Aplicação Base abre e entra em um modo jogável básico.
- `npm audit` do servidor deixa de reportar as vulnerabilidades atualmente identificadas.
- `CONTEXT.md` contém apenas glossário do Projeto.
- `SPEC.md` registra a fundação e o roadmap subsequente.

## Plano de Validação Manual

1. Instalar as dependências do servidor.
2. Iniciar o backend com `node server.js`.
3. Acessar `http://localhost:55555` e confirmar o carregamento da Aplicação Base.
4. Verificar no navegador que a aplicação entra em um modo jogável básico.
5. Executar `npm audit` no servidor e confirmar que as vulnerabilidades iniciais não permanecem.

## Roadmap Curto das Fases 1 a 4

### Fase 1

- Objetivo: containerização de desenvolvimento com hot-reload.
- Pré-condição herdada da fundação: Aplicação Base executando em ambiente atual com fluxo local reproduzível.
- Próximo artefato esperado: `Dockerfile` de desenvolvimento e instruções de uso.
- Status após esta etapa: `Dockerfile` de desenvolvimento implementado; falta validar e expandir com Compose na Fase 2.

### Fase 2

- Objetivo: orquestração local com aplicação e Postgres, mais persistência simples.
- Pré-condição herdada da fundação: backend estável e pronto para ser containerizado.
- Próximo artefato esperado: `docker-compose.yml` e camada simples de persistência.
- Status após esta etapa: `docker-compose.yml` com Postgres implementado e persistência simples de sessões adicionada ao backend.

### Fase 3

- Objetivo: pipeline de build e lint para front e back.
- Pré-condição herdada da fundação: execução local previsível e dependências saneadas.
- Próximo artefato esperado: workflow GitHub Actions para build e lint.
- Status após esta etapa: workflow de CI configurado com `npm ci`, `npm run lint` e `npm run build`.

### Fase 4

- Objetivo: testes unitários funcionais com evidência de quebra e correção.
- Pré-condição herdada da fundação: base executável e pipeline inicial preparados.
- Próximo artefato esperado: suíte inicial de testes e histórico de commits de falha/correção.
- Status após esta etapa: suíte de testes do backend integrada ao CI, com histórico explícito de falha e correção no pipeline.

## Visão Resumida das Fases 5 a 10

- Fase 5: fuzzing do backend.
- Fase 6: SAST e SCA.
- Fase 7: SonarCloud e cobertura mínima.
- Fase 8: containerização de produção com multi-stage build e Nginx.
- Fase 9: manifestos Kubernetes e, opcionalmente, Terraform.
- Fase 10: deploy contínuo, publicação de imagens, HTTPS e segurança de rede.

### Fase 5

- Objetivo: validar a resiliência do backend contra entradas inesperadas.
- Pré-condição herdada das fases anteriores: pipeline com lint, build e testes unitários já ativo.
- Próximo artefato esperado: suíte de fuzzing integrada ao CI.
- Status após esta etapa: fuzzing automatizado cobrindo validação de nomes de jogo e acesso seguro à coleção de partidas.

### Fase 6

- Objetivo: integrar segurança de código e dependências ao pipeline.
- Pré-condição herdada das fases anteriores: CI já executando build, lint, testes unitários e fuzzing.
- Próximo artefato esperado: SCA com `npm audit` e SAST com CodeQL.
- Status após esta etapa: workflow principal executa auditoria de dependências e workflow dedicado executa análise estática de segurança.

### Fase 7

- Objetivo: integrar qualidade de código e cobertura mínima com SonarCloud.
- Pré-condição herdada das fases anteriores: CI com build, lint, testes, fuzzing e segurança já ativo.
- Próximo artefato esperado: workflow dedicado do SonarCloud, relatório LCOV e parâmetros do projeto.
- Status após esta etapa: cobertura LCOV gerada no backend e análise SonarCloud pronta para ser habilitada com `SONAR_TOKEN`, `SONAR_PROJECT_KEY` e `SONAR_ORGANIZATION`.

### Fase 8

- Objetivo: empacotar a aplicação para produção com imagens Alpine otimizadas, multi-stage build e Nginx servindo o frontend.
- Pré-condição herdada das fases anteriores: aplicação estável, validada em CI e com dependências saneadas.
- Próximo artefato esperado: `Dockerfile.prod`, `Dockerfile.nginx`, `docker-compose.prod.yml` e configuração de proxy reverso do Nginx.
- Status após esta etapa: ambiente de produção local sobe com backend isolado, frontend servido por Nginx e tráfego dinâmico encaminhado para `/api` e `/socket.io`.
