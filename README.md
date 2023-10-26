# Student Task Management System

### Features
- Authentication: using JWT
- Authorization: Protected routes for access to resources.
- Endpoints for Admin Panel and Student Inerface
- Error Handling
- Typescript

### POSTMAN API DOCUMENTATION: [here](https://documenter.getpostman.com/view/24068251/2s9YRDzVpt)

## RUNNING THE SERVER


1. Clone the repository:

```CMD
git clone https://github.com/alanansari/tghtask.git
```
To run the server, you need to have NodeJS installed on your machine. If you don't have it installed, you can follow the instructions [here](https://nodejs.org/en//) to install it.



2. Install the dependencies: 

```CMD
npm install
```


3. Setup .env file in base directory:

```
PORT = 3000
MONGODB_URI = 'mongodb://localhost:27017/tgh-task'
JWT_ADMIN_KEY = 'admin'
JWT_STUDENT_KEY = 'student'
```


4. Run the backend server on localhost:

```CMD
npm start
```

5. Run on localhost:[PORT] (default: 3000)

