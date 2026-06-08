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
      mkjs-dev
    ```

O container executa `npm run dev` com `nodemon`. Mudanças em arquivos do servidor reiniciam automaticamente o processo. Mudanças no frontend estático em `game/` ficam disponíveis ao recarregar a página no navegador.

---

# Configuração Técnica

O `mk.js` pode ser configurado através do objeto de opções passado na inicialização:

*   `arena`: Propriedades da arena (container e tipo).
*   `fighters`: Array com os nomes dos dois jogadores.
*   `game-type`: Define o modo (`network`, `basic`, `multiplayer`).
*   `callbacks`: Funções disparadas em eventos como `attack` ou `game-end`.

# Licença

Este software é distribuído sob os termos da licença MIT.
