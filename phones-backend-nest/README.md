

# Описание

NEST+Prisma+SQLite TypeScript backend для телефонного справочника

## Создаем шаблон приложения

```bash
$ npm install -g @nestjs/cli
$ nest new backend-phones-nest
$ cd backend-phones-nest
$ npm install prisma --save-dev
$ npx prisma
$ npx prisma init
$ npm install @prisma/client

```


## Создаем ресурсы CRUD

```bash
$ npm i @nestjs/graphql
$ nest g resource phones
```

## Создаем Prisma сервис

```bash
$ touch src/prisma.service.ts
```

```
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

## Создаем Apollo GraphQL API
```bash
$ npm i @nestjs/apollo @apollo/server graphql apollo-server-plugin-base graphql-subscriptions graphql-ws
$ mkdir src/apollo
$ touch src/apollo/apollo.module.ts
$ touch src/apollo/spollo.plugin.ts
```
## Мигрируем, создаем модель в базе
```bash
$ npx prisma migrate dev --name init
```

## Просмотр данных
```bash
$ npx prisma studio
```

## Установка проекта из Git (если создавали сами, пропускаем)
clone before

```bash

$ npm install
```

## Запуск приложения

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


