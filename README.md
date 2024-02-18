## Full Stack Test Task

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

