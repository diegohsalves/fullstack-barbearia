# Barbershop-server [![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/diegohsalves/fullstack-barbearia/blob/master/LICENSE)

This is the back-end of the Barbershop System.

## Technologies

- Java 17
- Spring Boot 
- PostgreSQL
- H2 (DB for tests)

## Getting Started

### Prerequisites

To run this project in the development mode, you'll need to have Java 17 installed.

### Installing

**Cloning the Repository**

```
$ git clone https://github.com/diegohsalves/fullstack-barbearia
$ cd barbearia/backend
```

**Installing dependencies**

In the backend folder, run these commands:

```
maven clean install
maven spring-boot:run
```

### Models

#### Usuario

> *id*: User's id.

> *username*: User's name.

> *password*: User's password.

```json
{
  "id": {
    "type": "Long",
    "required": false,
  },
  "username": {
    "type": "String",
    "required": true,
  },
  "password": {
    "type": "String",
    "required": true,
  },
}
```

#### Cliente

> *id*: Customer's id.

> *nome*: Customer's name.

> *email*: Customer's email.

> *cpf*: Customer's cpf.

> *telefone*:  Customer's telefone.

> *agendamentos*: Set List that includes every scheduling of this Customer.
```json
{
  "id": {
    "type": "Long",
    "required": false,
  },
  "nome": {
    "type": "String",
    "required": true,
  },
  "email": {
    "type": "String",
    "required": true,
  },
  "cpf": {
    "type": "String",
    "required": true,
  },
  "telefone": {
    "type": "String",
    "required": true,
  },
  "agendamentos": {
    "type": "Set<Agendamento>",
    "required": false,
  },
}
```

#### Servico

> *id*: Service's id.

> *nome*: Service's name.

> *preco*: Service's price.

> *tempoDuracao*: Service's duration.

> *agendamentos*: Set List that includes every scheduling of this Service.

```json
{
   "id": {
    "type": "Long",
    "required": false,
  },
  "nome": {
    "type": "String",
    "required": true,
  },
  "preco": {
    "type": "BigDecimal",
    "required": true,
  },
  "tempoDuracao": {
    "type": "LocalTime",
    "required": true,
  },
  "agendamentos": {
    "type": "Set<Agendamento>",
    "required": false,
  },
}
```

#### Barbeiro

> *id*: Barber's id.

> *nome*: Barber's name.

> *domingo*: Barber's working day corresponding to Sunday  .

> *segunda*: Barber's working day corresponding to Monday.

> *terca*: Barber's working day corresponding to Tuesday.

> *quarta*: Barber's working day corresponding to Wednesday.

> *quinta*: Barber's working day corresponding to Thursday.

> *sexta*: Barber's working day corresponding to Friday.

> *sabado*: Barber's working day corresponding to Saturday.

> *entrada*: Barber's start of working time.

> *saida*: Barber's end of working time.

> *almoco*: Barber's start of lunch time.

> *retorno*: Barber's end of lunch time.

> *lista*: Barber's schedule's list.

> *agendamentos*: Set List that includes every scheduling of this Barber.

```json
{
   "id": {
    "type": "Long",
    "required": false,
  },
  "nome": {
    "type": "String",
    "required": true,
  },
  "domingo": {
    "type": "Boolean",
    "required": true,
  },
  "segunda": {
    "type": "Boolean",
    "required": true,
  },
  "terca": {
    "type": "Boolean",
    "required": true,
  },
  "quarta": {
    "type": "Boolean",
    "required": true,
  },
  "quinta": {
    "type": "Boolean",
    "required": true,
  },
  "sexta": {
    "type": "Boolean",
    "required": true,
  },
  "sabado": {
    "type": "Boolean",
    "required": true,
  },
  "entrada": {
    "type": "LocalTime",
    "required": true,
  },
  "saida": {
    "type": "LocalTime",
    "required": true,
  },
  "almoco": {
    "type": "LocalTime",
    "required": true,
  },
  "retorno": {
    "type": "LocalTime",
    "required": true,
  },
  "lista": {
    "type": "List<LocalTime>",
    "required": false,
  },,
  "agendamentos": {
    "type": "Set<Agendamento>",
    "required": false,
  },
}
```
#### Agendamento

> *id*: Scheduling's id.

> *cliente*: Chosen Customer.

> *barbeiro*: Chosen Barber.

> *servicos*: Set List of chosen services.

> *data*:  Scheduling's date.

> *horario*:  Scheduling time.

> *total*:  Scheduling's total price.

> *observacao*:  Scheduling's note space.

> *formaPagamento*:  Scheduling's enum for choose the payment method.

> *status*:  Scheduling's enum for choose the status.

```json
{
  "id": {
    "type": "Long",
    "required": false,
  },
  "cliente": {
    "type": "Cliente",
    "required": true,
  },
  "barbeiro": {
    "type": "Barbeiro",
    "required": true,
  },
  "servicos": {
    "type": "Set<Servico>",
    "required": false,
  },
  "data": {
    "type": "LocalDate",
    "required": true,
  },
  "horario": {
    "type": "LocalTime",
    "required": true,
  },
  "total": {
    "type": "BigDecimal",
    "required": false,
  },
  "observacao": {
    "type": "String",
    "required": false,
  },
  "formaPagamento": {
    "type": "FormaPagamento",
    "required": false,
  },
  "status": {
    "type": "AgendamentoStatus",
    "required": false,
  }
}
```

#### AgendamentoStatus
```json
 {
    "enum": "CONFIRMADO | CONCLUIDO | CANCELADO | REMARCADO | AUSENTE",
 }
```
#### FormaPagamento
```json
 {
    "enum": "DINHEIRO | CREDITO | DEBITO",
 }
```
