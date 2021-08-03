
# Question Answering System

This project is a Node.js powered API that allows users to send requests to multiple endpoints.

## Run Locally

1. Clone the project

```bash
  git clone https://github.com/aksoyih/QuestionAnsweringSystem.git
```

2. Go to the project directory

```bash
  cd QuestionAnsweringSystem
```

3. Install dependencies

```bash
  npm install
```
4. Start the MongoDB

5. Start the server

```bash
  npm run start
```
*or*
```bash
  npm run dev
```
# API Reference

## User related
### Signup
#### Teacher Signup

```http
  POST /users/teacher/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username to be signed up with. Will be used to log in|
| `name` | `string` | **Required**. Name of the user |
| `email` | `string` | **Required**. Email of the user. Must be a valid email adress |
| `password` | `string` | **Required**. Password of the user, will be used to log in. Minimum length: 7 |
| `courses` | `string` | **Required**. All the courses the teacher teaches. **Must be MongoDB ObjectiId** |
| `classes` | `string` | **Required**. All the classes the teacher teaches. **Must be MongoDB ObjectiId** |

#### Student Signup

```http
  POST /users/student/signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username to be signed up with. Will be used to log in |
| `name` | `string` | **Required**. Name of the user |
| `email` | `string` | **Required**. Email of the user. Must be a valid email adress |
| `password` | `string` | **Required**. Password of the user, will be used to log in. Minimum length: 7 |
| `courses` | `string` | **Required**. All the courses the teacher teaches. **Must be MongoDB ObjectiId** |
| `classes` | `string` | **Required**. All the classes the teacher teaches. **Must be MongoDB ObjectiId** |


### User Login

```http
  POST /users/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. Username of the user|
| `password` | `string` | **Required**. Password of the user|

Returns the user details alongside the login token if login is succesfull. 

### User Logout
```http
  POST /users/logout
```

Logs the user out from the current session by terminating the login token.

### Fetch Profile
```http
  GET /profile/me
```
Returns the user profile if the user is authenticated.

### Avatar

#### Upload Avatar
```http
  POST /profile/me/avatar
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `avatar` | `file` | **Required**. Avatar to be changed. Must be .jpg, .jpeg or .png and smaller or eqeual to 3MB in size|

#### Delete Avatar
```http
  DELETE /profile/me/avatar
```

Deletes the uploaded avatar of the user and changes it to the default one.

## Questions
User must be logged in in order the be authenticated to submit a question. Only student user types can submit questions.
### Add Question
```http
  POST /questions/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `course` | `string` | **Required**. Courses of the question. **Must be MongoDB ObjectiId** |
| `subject` | `string` | **Required**. Subject of the question. **Must be MongoDB ObjectiId** |
| `details` | `string` | Text details of the question.|
| `picture` | `file` | Picture of the question. Must be .jpg, .jpeg or .png and smaller or eqeual to 5MB in size |
| `audio` | `file` | Audio file of the question. Must be .mp3 or .wav and smaller or eqeual to 5MB in size |

Either details, picture or audio must be filled in. Returns the question object as JSON which contains the shortid of the question.

### Update Question
```http
  PATCH /questions/{shortid}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `course` | `string` | Courses of the question. **Must be MongoDB ObjectiId** |
| `subject` | `string` | Subject of the question. **Must be MongoDB ObjectiId** |
| `details` | `string` | Text details of the question.|
| `picture` | `file` | Picture of the question. Must be .jpg, .jpeg or .png and smaller or eqeual to 5MB in size |
| `audio` | `file` | Audio file of the question. Must be .mp3 or .wav and smaller or eqeual to 5MB in size |

Either details, picture or audio must be filled in. Parameters not empty will be updated in the database.

### Fetch Question
```http
  GET /questions/{question_shortid}
```
Returns the question object as JSON response if the question is found.

### Delete Question
```http
  DELETE /questions/{question_shortid}
```
Deletes the question from the database if the question is found.




## Answers
User must be logged in in order the be authenticated to submit an answer. Only teacher user types can submit answers.
### Add Answer
```http
  POST /answers/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `details` | `string` | Text details of the answer.|
| `picture` | `file` | Picture of the answer. Must be .jpg, .jpeg or .png and smaller or eqeual to 5MB in size |
| `audio` | `file` | Audio file of the answer. Must be .mp3 or .wav and smaller or eqeual to 5MB in size |
| `difficulty` | `number` | Difficulty level of the question.  Must be an integer number between 1 and 5|
| `question` | `string` | Id of the question to be answered. **Must be MongoDB ObjectiId** |

Either details, picture or audio must be filled in. Returns the question object as JSON which contains the shortid of the question.

### Update Answer
```http
  PATCH /answers/{question_shortid}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `details` | `string` | Text details of the answer.|
| `picture` | `file` | Picture of the answer. Must be .jpg, .jpeg or .png and smaller or eqeual to 5MB in size |
| `audio` | `file` | Audio file of the answer. Must be .mp3 or .wav and smaller or eqeual to 5MB in size |
| `difficulty` | `number` | Difficulty level of the answer.  Must be an integer number between 1 and 5|

Either details, picture or audio must be filled in. Parameters not empty will be updated in the database.

### Fetch Question
```http
  GET /answers/{question_shortid}
```
Returns the question object as JSON response if the question is found.

### Delete Question
```http
  DELETE /answers/{question_shortid}
```
Deletes the answer from the database if the question is found.





## Utils
Users authenticated as admins can access these enpoints.
### Classes

### Add Class
```http
  POST /classes/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `class_name` | `string` | Name of the class.|

### Add students to a classs
```http
  PATCH /classes/{class_ObjectId}/students
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `details` | `array of strings` | An array of strings containing valid MongoDB ObjectIds of students to be added to the class.|

#### Example JSON request

```json
{
    "students": [
        ...,
        "60ef218faae83b46c494372a",
        "60ef218faae83b46c494564s",
        "60ef218faae83b46c494985s",
        ...
    ]
}
```

### Fetch All Classes
```http
  GET /classes
```

### Fetch Single Class
```http
  GET /classes/{class_ObjectId}
```

### Update a Class
```http
  PATCH /classes/{class_ObjectId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `class_name` | `string` | Name of the class.|


### Delete Class
```http
  DELETE /classes/{class_ObjectId}
```
Deletes the class from the database if the class is found.





### Courses

### Add Course
```http
  POST /courses/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `course_name` | `string` | **Required** Name of the course.|
| `quota` | `number` | Amount of questions a student is allowed to submit per day. Default is 10|


### Fetch all Courses
```http
  GET /courses
```

### Fetch Single Class
```http
  GET /courses/{class_ObjectId}
```

### Update a Course
```http
  PATCH /courses/{course_ObjectId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `course_name` | `string` | Name of the course.|
| `quota` | `number` | Amount of questions a student is allowed to submit per day. Default is 10|


### Delete Course
```http
  DELETE /courses/{course_ObjectId}
```
Deletes the course from the database if the course is found.




### Subjects

### Add Subject
```http
  POST /subjects/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required** Name of the subject.|
| `course` | `number` | **Required** Course of the subject **Must be MongoDB ObjectiId**|


### Fetch all Subjects of a Course
```http
  GET /subjects/{course_ObjectId}
```

### Update a Subject
```http
  PATCH /subjects/{subject_ObjectId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required** Name of the subject.|

### Delete Course
```http
  DELETE /subjects/{subject_ObjectId}
```
Deletes the subject from the database if the subject is found.



### Achievements

### Add Achievement
```http
  POST /achievements/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `achievement_name` | `string` | **Required** Name of the achievement.|
| `course` | `number` | **Required** Course of the achievement **Must be MongoDB ObjectiId**|


### Fetch all achievements of a Course
```http
  GET /achievements/{course_ObjectId}
```

### Update a Achievement
```http
  PATCH /achievements/{achievement_ObjectId}
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `achievement_name` | `string` | **Required** Name of the achievement.|

### Delete Achievement
```http
  DELETE /achievements/{achievement_ObjectId}
```
Deletes the achievement from the database if the achievement is found.
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT`
Port of the Express application

`MONGODB_URL`
Required for the MongoDB connection

`JWT_SECRET`
A secret key that signs all the signup and login auth

*Pictures of the questions and answers as well as audio that is submitted will be stored on the AWS S3 service. Below given variables which start with `AWS_` are needed for the `aws-sdk` npm package to upload, download and read from the S3.*

`AWS_BUCKET_NAME`

`AWS_BUCKET_REGION`

`AWS_ACCESS_KEY`

`AWS_SECRET_KEY`


`DOMAIN`
Domain of the application.
## Tech Stack

**Server:** Node, Express

**Database:** MongoDB
  
## TODO List
- [ ]  Add user update endpoints
- [ ]  Add email verification
- [ ]  Add audio support
- [ ]  Add a basic frontend GUI
