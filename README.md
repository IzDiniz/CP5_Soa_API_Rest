# API de Reservas de Salas Corporativas

> CP1 — Arquitetura Orientada a Serviço | FIAP - 3ESPS - 2026 | Profa. Damiana Costa

API REST para gerenciamento de reservas de salas corporativas, desenvolvida com Node.js + Express, autenticação JWT e banco de dados SQLite.

---

## Tecnologias Utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js + Express | Framework da API |
| SQLite (better-sqlite3) | Banco de dados embutido |
| JWT (jsonwebtoken) | Autenticação e segurança |
| Swagger UI | Documentação interativa |
| CORS | Controle de acesso HTTP |

---

## Pré-requisitos

- **Node.js** versão 14 ou superior
- **npm** (incluso com Node.js)

---

## Como Executar

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd api-reservas
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. (Opcional) Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   # Edite o .env com sua chave JWT
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```
   Para desenvolvimento com auto-reload:
   ```bash
   npm run dev
   ```

5. Acesse a API em: `http://localhost:3000`

---

## Documentação Swagger

Com o servidor rodando, acesse a documentação interativa em:

**http://localhost:3000/api-docs**

---

## Autenticação (JWT)

As rotas de **criação de salas**, **criação de reservas** e **cancelamento de reservas** são protegidas por JWT.

**Passo 1** — Obtenha o token fazendo um POST para `/api/auth/login`:
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Passo 2** — Use o token no header de cada requisição protegida:
```
Authorization: Bearer <SEU_TOKEN>
```

---

## Endpoints

### Autenticação

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Gera token JWT | Não |

### Salas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/salas` | Lista todas as salas | Não |
| GET | `/api/salas/:id` | Busca sala por ID | Não |
| POST | `/api/salas` | Cadastra nova sala | Sim |

### Reservas

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| GET | `/api/reservas` | Lista todas as reservas | Não |
| GET | `/api/reservas/:id` | Busca reserva por ID | Não |
| POST | `/api/reservas` | Cria nova reserva | Sim |
| DELETE | `/api/reservas/:id` | Cancela reserva | Sim |

---

## Regras de Negócio

- Não é permitido criar reserva em sala com status `INATIVA`
- Não é permitido conflito de horário na mesma sala e data
- O horário final deve ser maior que o horário inicial
- Reservas canceladas não bloqueiam horários futuros
- Criação e cancelamento de reservas exigem autenticação JWT

---

## Padrão de Resposta de Erro

Todos os erros seguem o formato padronizado:

```json
{
  "timestamp": "2026-04-10T10:00:00.000Z",
  "status": 409,
  "error": "Conflict",
  "message": "Já existe reserva para esta sala no horário informado",
  "path": "/api/reservas"
}
```

---

## Arquitetura

```
api-reservas/
├── src/
│   ├── app.js                  # Configuração do Express
│   ├── config/
│   │   └── database.js         # Conexão e inicialização do SQLite
│   ├── controllers/
│   │   ├── SalaController.js   # Lógica de Salas
│   │   └── ReservaController.js# Lógica de Reservas
│   ├── middlewares/
│   │   ├── auth.js             # Middleware JWT
│   │   └── errorHandler.js     # Tratamento global de erros
│   ├── models/
│   │   ├── Sala.js             # Acesso a dados de Salas
│   │   └── Reserva.js          # Acesso a dados de Reservas
│   ├── routes/
│   │   └── index.js            # Definição das rotas
│   └── utils/
│       └── AppError.js         # Classe de erro personalizada
├── docs/
│   ├── swagger.yaml            # Documentação OpenAPI
│   └── arquitetura.png         # Diagrama de arquitetura
├── index.js                    # Ponto de entrada
├── .env.example                # Exemplo de variáveis de ambiente
├── .gitignore
└── README.md
```

---

## Grupo

- Nome do Aluno 1 — RM: XXXXX
- Nome do Aluno 2 — RM: XXXXX
- Nome do Aluno 3 — RM: XXXXX
- Nome do Aluno 4 — RM: XXXXX
- Nome do Aluno 5 — RM: XXXXX

---

## Respostas das Perguntas Discursivas

**1. Qual mecanismo de segurança foi utilizado e por quê?**

Foi utilizado **JWT (JSON Web Token)**. Essa abordagem foi escolhida por ser stateless (sem necessidade de armazenar sessões no servidor), amplamente adotada no mercado, fácil de integrar com clientes web e mobile, e por permitir expiração configurável do token, aumentando a segurança.

**2. Como a API trata conflitos de horário?**

Antes de criar uma reserva, a API consulta o banco de dados verificando se existe alguma reserva `ATIVA` para a mesma sala e data cujo intervalo de horário se sobreponha ao solicitado. Caso exista, retorna HTTP 409 Conflict com mensagem padronizada.

**3. Como foi estruturada a arquitetura da solução?**

A solução segue uma arquitetura em camadas: **Routes** recebem as requisições, **Middlewares** interceptam para autenticação e tratamento de erros, **Controllers** orquestram a lógica de negócio, **Models** abstraem o acesso ao banco de dados SQLite. Essa separação garante coesão, baixo acoplamento e facilidade de manutenção.
