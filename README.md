# BattleGo! Game

## Tech Stack

### Frontend: 
React, HTML, Javascript, SCSS
### Backend: 
MongoDB, ExpressJS, NodeJS

## How to run
Run the following command in your commandline/terminal in one of your folder:

```bash
git init   #if you haven't initialized a git repository
git clone https://github.com/pearlpisut/CSCI3100-Project-E2.git ./BattleGo
```
Then follow the instructions below to run the program on frontend and backend sides.
## BattleGo's Frontend

These program files are the frontend part of the BattleGo! Application

### How to run frontend side
Run the following command in your commandline/terminal in one of your folder:

```bash
cd BattleGo/Frontend
npm install
npm start
```

Afterwards, the program will be running at `localhost:3000`

## BattleGo's APIs
These program files are the bakend part of BattleGo! Application

### How to run backend side
Run the following command in your commandline/terminal in one of your folder:
```bash
cd BattleGo/Backend
npm install express dotenv
nodemon server.js
```
Then, add a `.env` file to the repository and add the following into the file
```bash
PORT = 2901
SECRET_PLAYER_KEY = <literally, anything. Perhaps number, e.g., 34234327>  # do not type the bracket '<', '>'
SECRET_ADMIN_KEY = <literally, anything. Perhaps number, e.g., 1823423>
```
Afterwards, the program will be running at `localhost:2901`, where the frontend React app will fetch data from. Note that if issues occur when using `.env` files, feel free to remove them as keys such as `PORT` and others have also been hard-coded to accommmodate this.

## Contributors
- Chan Chun Ming - 1155163257 (Server)
- Kyaw Shin Thant - 1155173026 (Game logics)
- Phutanate Pisutsin - 1155163440 (Backend)
- Oranuch Ekkowit - 1155168715 (Backend)
- Ho Chun Tou - 1155163338 (Frontend)
