# Como Rodar o Projeto

Este é um jogo de luta simples criado com HTML5 canvas e JavaScript. Ele possui três modos de jogo:
* `Básico` - com um jogador ativo e um inativo.
* `Multijogador` - com dois jogadores ativos em um computador.
* `Rede` - com dois jogadores ativos, jogando pela rede.

### Execução Local (Modo Básico/Multijogador)

Para rodar o jogo localmente, basta abrir o arquivo `game/index.html` em qualquer navegador moderno.

### Execução em Rede (Servidor Node.js)

Para o jogo em rede, você precisa iniciar o servidor:

1.  Navegue até a pasta do servidor:
    ```bash
    cd server
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor:
    ```bash
    node server.js
    ```

O servidor será iniciado na porta `55555`. Abra o navegador em `http://localhost:55555`. Ambos os jogadores devem inserir o mesmo nome de jogo para se conectarem.

Se a porta `55555` já estiver em uso no ambiente local, você pode sobrescrevê-la temporariamente:

```bash
PORT=55556 node server.js
```

### Execução em Desenvolvimento com Docker

Para subir a Aplicação Base em um container de desenvolvimento com hot-reload do servidor:

1. Na raiz do projeto, gere a imagem:
    ```bash
    docker build -t mkjs-dev .
    ```
2. Inicie o container montando o código-fonte:
    ```bash
    docker run --rm -it \
      -p 55555:55555 \
      -v "$(pwd)/server:/app/server" \
      -v "$(pwd)/game:/app/game" \
      -v mkjs_node_modules:/app/server/node_modules \
      mkjs-dev
    ```

O container executa `npm run dev` com `nodemon`. Mudanças em arquivos do servidor reiniciam automaticamente o processo. Mudanças no frontend estático em `game/` ficam disponíveis ao recarregar a página no navegador.

### Execução com Docker Compose e Postgres

Para subir a aplicação e o banco Postgres juntos:

```bash
docker compose up --build
```

Depois abra:

- `http://localhost:55555`

O backend passa a persistir sessões de jogo no Postgres quando o `DATABASE_URL` estiver configurado. Para inspecionar o histórico persistido:

- `http://localhost:55555/api/game-sessions`

Se a porta `55555` já estiver ocupada na sua máquina:

```bash
APP_PORT=55556 docker compose up --build
```

Para parar o ambiente:

```bash
docker compose down
```

### Verificação Local de Build e Lint

Para executar localmente as verificações da Fase 3:

```bash
cd server
npm install
npm run lint
npm run build
```

### Testes Unitários do Backend

Para executar os testes unitários locais da Fase 4:

```bash
cd server
npm install
npm test
```

### Testes de Fuzzing do Backend

Para executar os testes de fuzzing da Fase 5:

```bash
cd server
npm install
npm run test:fuzz
```

### Verificação de Segurança de Dependências

Para executar localmente a verificação SCA da Fase 6:

```bash
cd server
npm install
npm run sca
```

A análise SAST desta fase roda no GitHub Actions por meio do workflow `CodeQL`.

### Cobertura e SonarCloud

Para gerar a cobertura local usada pela Fase 7:

```bash
cd server
npm install
npm run test:coverage
```

O relatório LCOV será gerado em:

- `server/coverage/lcov.info`

Para ativar a análise no SonarCloud no GitHub, configure no repositório:

- secret `SONAR_TOKEN`
- variable `SONAR_PROJECT_KEY`
- variable `SONAR_ORGANIZATION`

### Produção com Nginx

Para validar a Fase 8 localmente:

```bash
docker compose -f docker-compose.prod.yml up --build
```

Esse fluxo sobe:

- backend Node.js em modo de produção
- Nginx servindo os arquivos estáticos do frontend
- Postgres interno para persistência simples

Endpoint principal:

- `http://localhost:8080`

Endpoint de API através do Nginx:

- `http://localhost:8080/api/game-sessions`

Se a porta `8080` já estiver ocupada:

```bash
PROD_PORT=8081 docker compose -f docker-compose.prod.yml up --build
```

Para encerrar:

```bash
docker compose -f docker-compose.prod.yml down
```

### Kubernetes local

Os manifestos da Fase 9 ficam em:

- `k8s/base`
- `k8s/overlays/local`
- `k8s/overlays/production`
- `k8s/cluster`

Para validar a renderização dos manifestos sem cluster ativo:

```bash
kubectl kustomize k8s/overlays/local
```

Para testar em um cluster local, primeiro gere ou carregue as imagens usadas no overlay:

```bash
docker build -f Dockerfile.prod -t projetoindividual-app:latest .
docker build -f Dockerfile.nginx -t projetoindividual-nginx:latest .
```

Depois aplique os manifestos:

```bash
kubectl apply -k k8s/overlays/local
kubectl port-forward -n mkjs service/mkjs-nginx 8080:80
```

Com isso, a aplicação ficará disponível em:

- `http://localhost:8080`

Para remover os recursos:

```bash
kubectl delete -k k8s/overlays/local
```

### Deploy contínuo com HTTPS

Para a Fase 10, o repositório passa a ter um workflow de CD em [`CD`](/Users/felipecampelo/projetoindividual/.github/workflows/cd.yml) que:

- publica as imagens `app` e `nginx` no GHCR
- aplica o `ClusterIssuer` do `cert-manager`
- cria os secrets necessários no namespace `mkjs`
- aplica o overlay `k8s/overlays/production`
- atualiza as imagens implantadas para a tag exata do commit

Pré-requisitos no cluster:

- controlador de Ingress Nginx instalado
- `cert-manager` instalado
- DNS do host público apontando para o IP do Ingress

Configurações necessárias no GitHub:

- secret `KUBE_CONFIG_B64`
- secret `POSTGRES_PASSWORD`
- variable `K8S_INGRESS_HOST`
- variable `LETSENCRYPT_EMAIL`

O `KUBE_CONFIG_B64` deve conter o kubeconfig do cluster em base64.

Os manifestos de produção usam:

- `k8s/cluster/cluster-issuer.yaml`
- `k8s/overlays/production/ingress.yaml`

O redirecionamento HTTP para HTTPS fica configurado no `Ingress` por meio das anotações do Nginx.

---

# Configuração Técnica

O `mk.js` pode ser configurado através do objeto de opções passado na inicialização:

*   `arena`: Propriedades da arena (container e tipo).
*   `fighters`: Array com os nomes dos dois jogadores.
*   `game-type`: Define o modo (`network`, `basic`, `multiplayer`).
*   `callbacks`: Funções disparadas em eventos como `attack` ou `game-end`.

# Licença

Este software é distribuído sob os termos da licença MIT.
