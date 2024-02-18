## Backend
### Project Scope
Implement a module that would allow a user to sign up and sign in, sign out to the application.

### app requirements

**Requirements:**
 - Develop the user authentication module using nestjs framework
 - integrateMongoDB as the database
 - You can choose the appropriate ORM and other libraries if needed

#### Sign Up Route:
Create a route that accepts with the following fields: email, name, and password.
Password requirements:
 - Minimum length of 8 characters
 - Contains at least 1 letter.
 - Contains at least 1 number.
 - Contains at least 1 special character.

#### Sign in Route:
 - Create a sign-in form with fields for email and password.


--- 

### To run dev server
```sh
# considering no alias for clone used
docker-compose up -d
cd backend
cp sample.env .env
npm install
npm run start:dev
```