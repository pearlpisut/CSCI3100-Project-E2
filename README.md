# BattleGo Game

## BattleGo's Frontend

These program files are the frontend part of the BattleGo! Application

## <> How to run
Run the following command in your commandline/terminal in one of your folder:

```bash
git init   #if you haven't initialized a git repository
git clone https://github.com/pearlpisut/CSCI3100-Project-E2.git --branch Frontend --single-branch ./frontend
cd frontend
npm install
npm start
```
Afterwards, the program will be running at `localhost:3000`

## BattleGo's APIs
These program files are the bakend part of BattleGo! Application

## <>How to run
Run the following command in your commandline/terminal in one of your folder:
```bash
git init   #if you haven't initialized a git repository
git clone https://github.com/pearlpisut/CSCI3100-Project-E2.git --branch Backend --single-branch ./backend
cd backend
npm install express dotenv
nodemon server.js
```
Then, add a `.env` file to the repository and add the following into the file
```bash
POST = 2901
SECRET_PLAYER_KEY = <literally, anything. Perhaps number, e.g., 34234327>
SECRET_ADMIN_KEY = <literally, anything. Perhaps number, e.g., 1823423>
```
Afterwards, the program will be running at `localhost:2901`, where the frontend React app will fetch data from.
