## Full Stack Test Task

### Note To Checker:

I have used angular from 2016-2018 and never really got a chance to play with nestjs, though I have been primarily using ApolloGraphQL, Express, and Fastify as api-servers through out my career. I would request to overlook framework-specific best practices if not followed properly. I wanted to clarify just to be on the same page.

We could have used 0Auth or Passport like libraries to wrap it all up in abstract fashion but that wouldn't really have been a test or demonstration of skills, I chose the route of custom-impelementation of token-creation and refresh-token route to demonstrate code-quality and my style of programming.

I have also used TypeORM which is a great tool for SQL like database but I always wanted to use it with mongoDB. It did great except a few things like { select: false } is still returning unselect docs and queryBuilder is not supported for mongoDB. Though, I would always go with mongoose for real-world mongoDB projects (if ORM is needed). 

I am available through the email to reason anything particular if you find confusing in the project or implementation.

-*Saad Abbasi*

### Tech Stack Used: 
 - Backend Language: **TypeScript**
 - Backend Framework: **NestJS@10**
 - Frontend Language: **TypeScript**
 - Frontend Framework: **React@18**
 - Database: **MongoDB**
 - ORM: **TypeORM**

### How to run the project:

Once the repository is fetch, navigate to the project folder 

```sh
git clone https://github.com/isaadabbasi/easygen-assignment

# considering no alias for clone used
cd easygen-assignment
```

### Steps: 

#### 1: Setup env files
Goto Frontend folder

Copy `sample.env` to new file `.env`
Goto Backend folder

Copy `sample.env` to new file `.env`

```sh
# pwd: <path-to-project>/easygen-test
cd ./frontend
cp sample.env .env

cd ../backend
cp sample.env .env

```

#### 1/3: Build projects and services

```sh
make build
```

#### 2/3: Run backend application

Open up a new terminal instance and run
```sh
make up-backend
```

#### 3/3: Run frontend application

Open up a new terminal instance and run
```sh
make up-frontend
```

#### To run tests
```sh
make test-backend
```

