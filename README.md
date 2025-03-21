## Pré-Requisitos
  [NodeJS](https://nodejs.org/en/download)
  
  [PostgreSQL](https://www.postgresql.org/download/) 
  
## Configurando BD

No meio da instalação do PostgreSQL pedirá uma senha para o superuser (postgres), para não ter que mudar o codigo coloque "admin"

Abra o pragrama pgAdmin 4, instalado pelo PostgreSQL, clique em Servers e ponha a senha registrada na instalação

Clique com o botão direito em Databases depois Create -> Database... escolha o nome do BD, coloque ```teste_tecnico_backend``` para não precisar alterar o código, e clique em Save

Depois, se precisar, abra o arquivo ```src/app.module.ts``` e substitua os campos: username, password e database, criados acima

Para ver as tabelas depois de executar o programa entre em Databases -> teste_tecnico_backend -> Schemas -> Public -> Tables

## Executar Comandos 

  [Postman](https://www.postman.com/)
  
  [Documentação do Projeto no Postman](https://documenter.getpostman.com/view/43293262/2sAYkGKePZ)

## Project setup
```bash
$ git clone github.com/JocaCouto14/teste-tecnico-backend-joca
```
```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start
```

## Run tests

```bash
# unit tests
$ npm run test
```
