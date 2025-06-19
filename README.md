# Como Rodar o Sistema no Seu PC

## 1. Clonando o Repositório

Escolha uma pasta no seu computador para clonar o projeto. No exemplo, usaremos a pasta `Documents`.

```bash
cd Documents
git clone https://github.com/arthuracmm/AppWhats
code .
```

---

## 2. Configurando o Robô do WhatsApp

Após abrir o projeto no Visual Studio Code, abra o primeiro terminal e execute:

```bash
cd robot
npm install
node msgRobot.js
```

Isso abrirá o WhatsApp Web no navegador em modo anônimo. Você precisará fazer login manualmente escaneando o QR Code.

![Login WhatsApp Web](https://github.com/user-attachments/assets/6f286cf1-5d79-40f5-874b-33696a2e99f7)

### Após o login:

* Remova a imagem que aparece no centro da tela logo no início:

![Imagem inicial](https://github.com/user-attachments/assets/2caa6a09-63d7-4a18-8c58-d90ed1a07cbb)

* Remova também o botão que aparece assim que o robô abre uma conversa:

![Botão ao abrir conversa](https://github.com/user-attachments/assets/e9c2958a-429a-4c9b-acc3-658e604431b0)

---

O robô irá coletar dados dos 10 primeiros usuários (apenas mensagens de texto, sem áudios, imagens ou figurinhas), armazenando-os no arquivo `WHATSAPP.DB` dentro da pasta `robot`. Após concluir, o WhatsApp Web será fechado automaticamente.

---

## 3. Inicializando a Interface Web

### Backend

Abra um novo terminal no VS Code e execute:

```bash
cd backend
npm install
npx tsx server.js
```

Você verá uma mensagem como:

```bash
API rodando em http://localhost:3001
```

Para verificar os dados coletados, acesse a rota:

```
http://localhost:3001/mensagens
```

---

### Frontend

Abra outro terminal e execute:

```bash
cd frontend
npm install
npm run dev
```

A saída será algo como:

```bash
VITE v6.3.5  ready in 909 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## Resultado Final

Agora você tem um sistema web semelhante ao WhatsApp Web, usando seus próprios dados! Esse sistema pode ser utilizado para:

* Desenvolvimento de sistemas de bate-papo personalizados;
* Integração com o WhatsApp de empresas;
* Separação e organização dos usuários que enviam mensagens para diferentes funcionários.

Fica a dica para explorar e expandir o sistema conforme sua necessidade!

---

Se precisar de ajuda, estou à disposição! 😄

---
