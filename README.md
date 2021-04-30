# Nestjs seed with knex

This is a seed project that comes with nest and knex ready to build your application. Here is a list of the major tools we use.

* Nestjs
* knex
* winston
* jest
* chai
* sinon
* editorconfig
* airbnb eslint
* prettier
* docker-compose


Starting the application:

First we need to create an external network with Docker. This is necessary for your service to see and be seen by other services.
Because of that it is important that your services have unique names across the project.

```bash 
docker network create services
```

Then you can copy the `.env.example` file to `.env` and fill the appropriate values

The deployment is exactly the same as a nodejs deployment except you MUST run all commands through the node docker-compose container.
For example to install dependencies you run:

```bash
docker-compose run --rm node npm i
```

After that you can use start the database and run the migrations/seeding.

```bash

docker-compose up database
docker-compose run --rm node npm run ts-knex --knexfile=your-knex-file.ts -- migrate:latest

```

To start the project, install the dependencies and run

```bash 
docker-compose up
```

## Knex cli commands

We provide the following knex commands.

```bash
docker-compose run --rm node npm run ts-knex # for typescript 

docker-compose run --rm node npm run knex # for plain javascript
```

These commands accept the same options as knex commands, for example:

```bash
    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:make -x ts migration-name # Create a migration in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts seed:make -x ts seed-name # Create a seed in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:latest # Run all migrations in typescript
    
    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts migrate:rollback # Rollback a single migration in typescript

    docker-compose run --rm node npm run ts-knex -- --knexfile=my-knexfile.ts -- seed:run # Run all seeds in typescript

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js -- migrate:latest # Run all migrations in javascript

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js -- migrate:rollback # Rollback a single migration in javascript

    docker-compose run --rm node npm run knex -- --knexfile=my-knexfile.js -- seed:run # Run all seeds in javascript
```

It is important to not mix typescript and javascript commands. Always use typescript for development to avoid corrupt directory errors and so you can seed an run migrations in your tests.
## Running tests

If your tests use the database you have to start it before running them.
Just run the commands bellow (you can pass --service-ports if you want to attach a debugger)

```bash
docker-compose run --rm node npm run test # Run tests normally

docker-compose run --rm node npm run test:watch # Run tests in watch mode

docker-compose run --rm node npm run test:debug # Run tests in debug mode

docker-compose run --rm node npm run test:cov # Run tests with coverage report
```

## Running eslint

The command bellow will autofix every eslint/prettier problem in src files

```bash
docker-compose run --rm node npm run lint
```


## Directory structure

Each service MUST be a module in nest, meaning it has its own folder and its own files and imports. This provides isolation between services while keeping deployment simple. The shared folder contains definitions shared across services. The config folder contains shared configs, for example, class validator configs. Here is an example of a base structure:

```
src/
  shared/
  config/
  my-service/
    my-service.controller.ts
    my-service.service.ts
    my-service.repository.ts
    test/
      my-service.controller.spec.ts
      my-service.service.spec.ts
      my-service.repository.spec.ts
    database/
      knexfile.ts
      migrations/
      seeds/
  app.module.ts
  app.env.ts
  main.ts
```

## Configuring knex

Each module can implement its own knex instance. It should have a database directory containing a knex file in the following format:

```typescript
import * as path from 'path';
import { knexConfigs } from '../config/knex/knex.config';

const knexConfigs: Knex.Config = {
  client: 'pg',
  connection: {
    host: env.MY_PROJECT_DB_HOST,
    user: env.MY_PROJECT_DB_USERNAME,
    password: env.MY_PROJECT_DB_PASSWORD,
    database: env.MY_PROJECT_DB_DATABASE,
    port: env.MY_PROJECT_DB_PORT,
    pool: {
      testOnBorrow: true,
    },
  },
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations')
  },
  seeds: {
    timestampFilenamePrefix: false,
    directory: path.join(__dirname, 'seeds');
  },
};

export default knexConfigs;
```

After that make your module import a knex instance using:

```typescript
@Module({
  imports: [KnexModule.register(MY_PROJECT_KNEX_TOKEN, knexConfigs)],
})
export class MyModule {}
```

After that you can inject knex like any other nest injectable using:

```typescript
constructor(
    @Inject(MY_PROJECT_KNEX_TOKEN)
    protected knex: Knex,
  ) {}
```


## Implementation

This implementation contains two services, user and cats. You must run knex cli command using their respective knexfiles before
starting the project. We also added some tools like swagger support to make understanding the API easier for a beginner.
You can access the docs at localhost:3000/api
