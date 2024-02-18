## Frontend
### Project Scope
Implement a module that would allow a user to sign up and sign in, to the application.

### app requirements

**Requirements:**
 - Develop the user authentication module using either the React or Vue framework.
 - Design elements are open to your creativity. 
 - You have the flexibility to choose any additional modules or libraries (including design frameworks) if necessary

#### Sign up page:
Create a signup form with the following fields: email, name, and password. After
successful signup, users should be redirected to the application page.
Password requirements:
 - Minimum length of 8 characters
 - Contains at least 1 letter.
 - Contains at least 1 number.
 - Contains at least 1 special character.

#### Sign in Page:
 - Create a sign-in form with fields for email and password.

#### Home Page:
 - Create a HomePage where the application redirects once the user is signed in or signed up


 ---- 

 ### To run dev server
```sh
# considering no alias for clone used
# and backend and container services are already running
cd frontend
docker-compose up -d
cp sample.env .env

npm install 
npm run start
```