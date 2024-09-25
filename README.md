# Coin collection Backend

An app to collect all european coin faces from all euro coin types.
Typescript REST API using node.js express and some other cool stuff.

## My stack

![image](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

![image](https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)

![image](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

![image](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)

![image](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)

![image](https://img.shields.io/badge/Zod-000000?style=for-the-badge&logo=zod&logoColor=3068B7)

![image](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

![image](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=Cloudinary&logoColor=white)

![image](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

![image](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white)

![image](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

![image](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white)

![image](https://img.shields.io/badge/Prometheus-000000?style=for-the-badge&logo=prometheus&labelColor=000000)

![image](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

Bcrypt, Cookie-parser, Dayjs, Dotenv, CORS, Helmet, Multer, http-status-codes, JWT, lodash, mime, mongoose, nodemailer, pino, slugify...

## Install

How to Install and use

```npm
  npm i
  npm run dev
```

## Enviroment variables

To run the project you wil need to add the following env variables

Mongodb URI

`MONGO_URI`

Google Auth

`GOOGLE_CLIENT_ID`
`GOOGLE_CLIENT_SECRET`
`GOOGLE_CLIENT_OAUTH_REDIRECT_URL`

## Folder Structure

- `__tests__/` - Contains test files and test fixtures.
  - `__fixtures__/` - Contains test fixture data.
- `controller/` - Contains all the controllers for handling requests and responses.
- `middleware/` - Contains all the middleware functions used in the application.
- `models/` - Contains the data models for the application.
- `permissions/` - Contains files related to user permissions and roles.
- `routes/` - Contains the route definitions and configuration.
- `schema/` - Contains schema definitions, likely for validation or data models.
- `service/` - Contains business logic and service layer.
- `types/` - Contains TypeScript types and interfaces.
- `utils/` - Contains utility functions and helper methods.

## Docs

Run the server then go to _/swagger_

## Features

- dotenv
- Sessions
- Cookies
- Acess & Refresh tokens (JWT)
- Hashing (bcrypt)
- Cloud Storage (Cloudinary)
- Image size, compression, crop, and file formats specified
- CRON jobs (delete inactive accounts, delete accounts who have not confirmed their email)
- RBAC (permission based) Authentication.
- I18n
- Rate Limiting
- **will add more**

## Download the app

![App Photo](https://via.placeholder.com/468x300?text=App+Screenshot+Here)

## Tests

To run the tests use

```npm
  cd __tests__
  npm test
```
