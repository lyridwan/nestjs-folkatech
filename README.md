# Folkatech Technical Test (Muhammad Ridwan)

## Description
- API service: `http://localhost:3000/`
- API documentation/swagger: `http://localhost:3000/swagger/`
- Default User: `admin@default.com` 
- Default Password: `admin`

## Project Structure
1. `src/modules` folder contains API-related files (controllers, service, dtos, entities, etc)
2. `src/shared` folder contains Project-related files (config, caching, logging, global request/response handler, etc)

## Task Completed
- Create microseservices (nodejs) for CRUD operation and store in database (mongodb) for user data
- Protect the API with the authorization header
- Validate the header request (authorization header)
- Implement caching strategy (redis) for vehicle data. (any data changes in mongodb will sync to redis) 
- Deploy into docker using docker compose
- Provide API to generate the token: `http://localhost:3000/api/v1/auth/login`. Auth using username & password on `.env` file. (`DEFAULT_ADMIN_USER` & `DEFAULT_ADMIN_PASSWORD`)

## Requirements
1. MongoDb
2. Redis
3. Docker

## Installation

```bash
$ npm install
$ cp .env.example .env
```

## Running the app using Docker Compose (the easiest way)
```sh
# Build the docker image
$ docker-compose build

# Start the container (service will running on port 3000)
$ docker-compose up
```

## Running the app using node server (the normal way)
```bash
# development
$ npm run start

# watch mode (hot reload)
$ npm run start:dev

# production mode
$ npm run build
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

## Support
Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
