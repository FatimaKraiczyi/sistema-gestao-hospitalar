# Sistema de Gestão Hospitalar

## Visão Geral
O Sistema de Gestão Hospitalar é uma aplicação distribuída projetada para gerenciar operações hospitalares de forma eficiente. Ele é construído usando uma arquitetura de microsserviços, com um API Gateway que roteia solicitações para vários serviços, garantindo uma separação clara de responsabilidades e escalabilidade.

## Objetivos
- Desenvolver um sistema abrangente para gerenciar operações hospitalares, incluindo registro de pacientes, agendamento de consultas e gerenciamento de funcionários.
- Implementar autenticação segura usando JWT.
- Utilizar PostgreSQL para persistência de dados.
- Containerizar a aplicação usando Docker para facilitar o deployment e a gestão.

## 🚀 Tecnologias Utilizadas

- Java 17 + Spring Boot
- PostgreSQL
- Node.js + Express (API Gateway)
- JWT (Autenticação)
- Docker + Docker Compose
- pgAdmin (para visualização do banco)

## 🧩 Estrutura do Projeto
O projeto está organizado nos seguintes componentes principais:

- **auth-service**: gerenciamento de autenticação e geração de tokens JWT.
- **api-gateway**: roteamento de requisições, autenticação centralizada.

## 🧪 Pré-requisitos

- JDK 17
- Maven
- Docker e Docker Compose 
- (Opcional) pgAdmin para visualizar os dados no banco

## 🛠️ Como Rodar o Projeto

1. **Clone o repositório**

```bash
git clone https://github.com/FatimaKraiczyi/sistema-gestao-hospitalar.git
cd sistema-gestao-hospitalar
```

2. **Gere o `.jar` do `auth-service` (caso necessário)**

```bash
cd auth-service
mvn clean package -DskipTests
cd ..
```

3. **Suba os containers**

```bash
docker-compose up --build
```

## 🧑‍💻 Serviços Disponíveis

| Serviço        | Porta | Descrição                      |
|----------------|-------|--------------------------------|
| API Gateway    | 3000  | Entrada principal da API       |
| Auth DB        | 5433  | PostgreSQL do auth-service     |
| pgAdmin        | 5050  | Interface web para o banco     |

## 🔐 Usuário Padrão Pré-Cadastrado (auth-service)

| Campo     | Valor                      |
|-----------|----------------------------|
| Nome      | Funcionário Padrão         |
| CPF       | 90769281001                |
| E-mail    | func_pre@hospital.com      |
| Senha     | TADS                       |
| Tipo      | FUNCIONÁRIO                |

> Este usuário serve para fazer os primeiros testes de autenticação e administração no sistema.

## 🐘 Acesso ao Banco via pgAdmin

- **URL**: http://localhost:5050
- **Login**: `admin@hospital.com`
- **Senha**: `admin`
- **Servidor do auth-service**:
  - Host: `authdb`
  - Porta: `5432` (interna) ou `5433` (externa)
  - Banco: `authdb`
  - Usuário: `authuser`
  - Senha: `authpass`

