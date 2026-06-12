# Trabalho Individual - Gerência de Configuração e Evolução de Software (2026-1)

Os conhecimentos de Gerência de Configuração e Evolução de Software (GCES) são fundamentais no ciclo de vida de um produto de software moderno. Este trabalho tem como objetivo exercitar os conceitos de automação, isolamento de ambiente, testes, segurança (DevSecOps) e deploy contínuo.

A aplicação base é o **mk.js**, um jogo de luta implementado com Backend em Node.js/Express e Frontend em HTML5 Canvas/JavaScript. O projeto original é considerado *deprecated* e possui dependências antigas; parte do desafio é modernizar o ambiente para que ele execute com versões estáveis atuais.

## Requisitos do Projeto

O trabalho está dividido em 10 etapas, cada uma valendo **1,0 ponto**. O foco é a implementação técnica aliada à correta documentação e histórico de commits.

### Critérios de Avaliação (10 Fases)

| Fase | Descrição Técnica | Nota por etapa |
|---|---|---|
| 1. **Containerização (DEV)** | Elaboração de `Dockerfile` para ambiente de desenvolvimento com suporte a hot-reload (mudanças no código refletidas imediatamente no container). | 0-10% |
| 2. **Docker Compose (DEV)** | Configuração de um `docker-compose.yml` que integre a aplicação e um banco de dados **Postgres**. Você deve implementar uma camada simples de persistência no código (ex: salvar histórico de lutas ou nomes de jogadores). | 10% - 20% |
| 3. **CI - Build & Lint** | Automação das etapas de Build e Lint (Front e Back) via GitHub Actions. O pipeline deve falhar se o lint encontrar erros. | 20% - 30% |
| 4. **CI - Testes Unitários** | Implementação de testes unitários funcionais. **Obrigatório:** Commits sequenciais demonstrando o teste quebrando no CI e, em seguida, passando após correção. | 30% - 40% |
| 5. **CI - Testes de Fuzzing** | Implementação de testes de Fuzzing para validar a resiliência das entradas do servidor (Back-end) contra dados inesperados. | 40% - 50% |
| 6. **Segurança - SAST & SCA** | Integração de ferramentas de análise estática de segurança (SAST) e verificação de vulnerabilidades em dependências (SCA - ex: Snyk ou npm audit). | 50% - 60% |
| 7. **Qualidade de Código** | Integração completa com o **SonarCloud** no pipeline de CI, garantindo métricas de qualidade e cobertura mínima. | 60% - 70% |
| 8. **Containerização (PROD)** | Elaboração de `Dockerfiles` otimizados para produção (multi-stage build, baseados em Alpine) e configuração do **Nginx** como servidor de arquivos estáticos. | 70% - 80% | 
| 9. **Infraestrutura (K8s & Terraform)** | Criação de manifestos de **Kubernetes (K8s)** para orquestração da aplicação. Opcionalmente, utilize **Terraform** para provisionar a infraestrutura necessária. | 80% - 90% |
| 10. **CD & Segurança de Rede** | Deploy Contínuo com publicação de imagens e configuração de **HTTPS via Cert Manager**. O Nginx deve redirecionar porta 80 para 443 e não expor outras portas para fora da rede de containers. | 90% - 100% |

## Orientações Gerais

*   **Repositório:** O trabalho deve ser desenvolvido em um repositório pessoal no GitHub.
*   **Commits:** Devem ser atômicos e espaçados no tempo. Commits realizados todos juntos na data de entrega serão penalizados.
*   **Modernização:** É responsabilidade do aluno atualizar o `package.json` e as dependências do servidor para garantir compatibilidade com as versões mais recentes do Node.js.
*   **Documentação:** O `README.md` final deve conter o passo a passo de como subir o ambiente de desenvolvimento e como visualizar o ambiente de produção.

Boa sorte!

## Estado Atual da Implementação

O projeto já possui uma **fundação transversal** concluída para executar em ambiente Node.js atual e um **Dockerfile de desenvolvimento** para a Fase 1.

### Mapa de Evidências por Fase

- Fase 1: [`Dockerfile`](/Users/felipecampelo/projetoindividual/Dockerfile) com ambiente de desenvolvimento e hot-reload
- Fase 2: [`docker-compose.yml`](/Users/felipecampelo/projetoindividual/docker-compose.yml) e persistência simples no backend em [`server/db.js`](/Users/felipecampelo/projetoindividual/server/db.js)
- Fase 3: workflow [`CI`](/Users/felipecampelo/projetoindividual/.github/workflows/ci.yml)
- Fase 4: testes em [`server/test`](/Users/felipecampelo/projetoindividual/server/test) e histórico de commits de quebra/correção no Git
- Fase 5: fuzzing em [`server/test/fuzz.test.js`](/Users/felipecampelo/projetoindividual/server/test/fuzz.test.js)
- Fase 6: workflow [`CodeQL`](/Users/felipecampelo/projetoindividual/.github/workflows/codeql.yml) e script `npm run sca`
- Fase 7: workflow [`SonarCloud`](/Users/felipecampelo/projetoindividual/.github/workflows/sonarcloud.yml) e [`sonar-project.properties`](/Users/felipecampelo/projetoindividual/sonar-project.properties)
- Fase 8: [`Dockerfile.prod`](/Users/felipecampelo/projetoindividual/Dockerfile.prod), [`Dockerfile.nginx`](/Users/felipecampelo/projetoindividual/Dockerfile.nginx) e [`docker-compose.prod.yml`](/Users/felipecampelo/projetoindividual/docker-compose.prod.yml)
- Fase 9: manifestos em [`k8s/base`](/Users/felipecampelo/projetoindividual/k8s/base/kustomization.yaml) e [`k8s/overlays/local`](/Users/felipecampelo/projetoindividual/k8s/overlays/local/kustomization.yaml)
- Fase 10: workflow [`CD`](/Users/felipecampelo/projetoindividual/.github/workflows/cd.yml) e overlay HTTPS local em [`k8s/overlays/local-https`](/Users/felipecampelo/projetoindividual/k8s/overlays/local-https/kustomization.yaml)

### Ambiente de Desenvolvimento

Execução local:

```bash
cd server
npm install
node server.js
```

Execução com Docker e hot-reload:

```bash
docker build -t mkjs-dev .
docker run --rm -it \
  -p 55555:55555 \
  -v "$(pwd)/server:/app/server" \
  -v "$(pwd)/game:/app/game" \
  -v mkjs_node_modules:/app/server/node_modules \
  mkjs-dev
```

No modo containerizado, o servidor roda com `nodemon`, reiniciando automaticamente quando arquivos do backend forem alterados. Arquivos estáticos do frontend ficam disponíveis ao recarregar a página.

### Ambiente com Docker Compose e Postgres

```bash
docker compose up --build
```

Esse fluxo sobe:

- a aplicação Node.js em modo de desenvolvimento
- um banco Postgres para persistência simples das sessões de jogo

O histórico persistido pode ser consultado em:

- `http://localhost:55555/api/game-sessions`

Se a porta `55555` já estiver em uso no host, você pode sobrescrevê-la:

```bash
APP_PORT=55556 docker compose up --build
```

### CI de Build e Lint

O projeto também possui um workflow de CI no GitHub Actions para a Fase 3.

Validações executadas:

- `npm run lint` no backend e nos arquivos JavaScript do frontend
- `npm run build` como checagem sintática e estrutural de frontend e backend
- `npm test` para testes unitários funcionais do backend
- `npm run test:fuzz` para fuzzing das entradas do backend
- `npm run sca` para auditoria de dependências com `npm audit`
- workflow `CodeQL` para análise estática de segurança no GitHub
- `npm run test:coverage` para gerar cobertura consumida pelo SonarCloud
- workflow `SonarCloud` para análise de qualidade e cobertura no GitHub

### Ambiente de Produção

O projeto também possui um empacotamento de produção para a Fase 8 com:

- backend Node.js em imagem Alpine com multi-stage build
- Nginx em Alpine servindo os arquivos estáticos do frontend
- proxy do Nginx para `/api` e `/socket.io`

Para subir o ambiente de produção localmente:

```bash
docker compose -f docker-compose.prod.yml up --build
```

A aplicação ficará disponível em:

- `http://localhost:8080`

Se a porta `8080` estiver ocupada no host:

```bash
PROD_PORT=8081 docker compose -f docker-compose.prod.yml up --build
```

### Kubernetes

O projeto também possui manifestos de Kubernetes para a Fase 9, organizados com `kustomize` em:

- `k8s/base`
- `k8s/overlays/local`
- `k8s/overlays/local-https`

Os manifestos contemplam:

- `Deployment` e `Service` para backend, Nginx e Postgres
- `PersistentVolumeClaim` para persistência do Postgres
- `ConfigMap` para o proxy reverso do Nginx
- `Secret` para variáveis sensíveis mínimas da aplicação e do banco

Para ambiente local, o overlay `k8s/overlays/local` usa imagens locais:

- `projetoindividual-app:latest`
- `projetoindividual-nginx:latest`

### CD e HTTPS

A Fase 10 adiciona:

- workflow [`CD`](/Users/felipecampelo/projetoindividual/.github/workflows/cd.yml) para publicar imagens no GHCR
- overlay Kubernetes local com `Ingress` HTTPS em `mkjs.local`
- `Issuer` self-signed do `cert-manager`
- redirecionamento HTTP para HTTPS no `Ingress` do Nginx

Para a demonstração local, o fluxo esperado é:

- publicar imagens no GHCR pelo GitHub Actions
- subir um cluster local com `ingress-nginx`
- instalar `cert-manager`
- apontar `mkjs.local` no `/etc/hosts` para o endereço local usado na demonstração
- gerar imagens locais compatíveis com a arquitetura do cluster
- aplicar `k8s/overlays/local-https`

Inferência baseada nas documentações oficiais usadas: a publicação no GHCR usa autenticação do GitHub Actions com `GITHUB_TOKEN`, e o TLS local é materializado por `cert-manager` com um `Issuer` self-signed associado ao `Ingress`.

Validação realizada no ambiente do Projeto:

- `cert-manager` emitiu o certificado local `mkjs-local-tls`
- o `Ingress` `mkjs-nginx` foi criado no namespace `mkjs`
- a máquina local já tinha as portas `80` e `443` ocupadas
- por isso, a verificação final do fluxo HTTP/HTTPS foi feita com `kubectl port-forward` do `ingress-nginx` em `8080:80` e `8443:443`
- o host `mkjs.local` foi validado nos testes com header `Host` explícito

Evidências da validação:

- `curl -I -H 'Host: mkjs.local' http://127.0.0.1:8080` retornou `308 Permanent Redirect`
- `curl -k -I -H 'Host: mkjs.local' https://127.0.0.1:8443` retornou `200`
- `curl -k -H 'Host: mkjs.local' https://127.0.0.1:8443/api/game-sessions` retornou `{"enabled":true,"sessions":[]}`
