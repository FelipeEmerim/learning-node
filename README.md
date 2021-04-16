<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository integrated with:

* mikro-orm
* swagger
* winston
* jest
* airbnb eslint
* editorconfig
* prettier
* class-transformer
* class-validator

## Installation

```bash
docker-compose run --rm node npm install
```

## Running the app

Copy the .env.example file to .env and fill the appropriate values.

```bash
# To start the application and its containers run
docker-compose up

# To start elastic search, kibana and apm to test logs run
docker-compose -f docker-compose-kibana.yml up
```

After that you can access the app in localhost:3000 and the docs
in localhost:3000/api

## Custom scripts
The project comes with a set of scripts to run repetitive tasks.
By default run commands do not expose ports, to attach a debugger
it is necessary to add the --service-ports flag to the docker-compose 
run command

To run migrations you need to up the database container

```bash
# Run prettier formatter
docker-compose run --rm node npm run format

# start the application
docker-compose run --rm node npm run start

# start the application in watch mode (live reload)
docker-compose run --rm node npm run start:dev

# start the application in watch mode (live reload) and with a debug listener
docker-compose run --rm node npm run start:debug

# start the application in prodution mode
docker-compose run --rm node npm run start:prod

# apply eslint + prettier rules to the project
docker-compose run --rm node npm run lint

# Run unit tests
docker-compose run --rm node npm run test

# Run unit tests in watch mode (live reload)
docker-compose run --rm node npm run test:watch

# Run unit tests in with coverage report
docker-compose run --rm node npm run test:cov

# Run unit tests in debug mode, waits until debugger is attached. Use with --service-ports
docker-compose run --rm node npm run test:debug

# Run end to end tests
docker-compose run --rm node npm run test:e2e

# Run a mikro-orm command using typescript
docker-compose run --rm node npm run mikro-orm

# Generate a mikro-orm migration using typescript
docker-compose run --rm node npm run migration:create

# Apply lint to migrations after a migration is created (automatically run by npm after migration:create)
docker-compose run --rm node npm run postmigration:create

# Run all migrations up to the latest version
docker-compose run --rm node npm run migration:run

# Downgrade migrations in 1 version, use with --all to downgrade all versions
docker-compose run --rm node npm run migration:revert

# Apply lint to migrations folder
docker-compose run --rm node npm run migration:lint
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
