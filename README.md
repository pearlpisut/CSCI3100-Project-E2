# BattleGo! Game

This project is a part of CSCI3100 Software Engineering.

## Introduction

`BattleGo!` is inspired by the classic game of Gomoku or Gobang - so you already know the game rules. It supports both Multiplayer, where you can compete against your friend, and Machine-player mode, where you can try to challenge our AI player programmed to beat you! at different difficulty level you can choose. There are more features and details to discover in the game. Please find the details below for the information about the developments of the program and how to run it.

<p align="center">
<img src = "https://i.imgur.com/Ro6YHMY.png" width="650">
</p>

## Tech Stack
(MERN Application)
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
# in ./BattleGo/Frontend
npm install
npm start
```

Afterwards, the program will be running at `localhost:3000`

## BattleGo's Backend
These program files are the bakend part of BattleGo! Application

### How to run backend side
Run the following command in your commandline/terminal in one of your folder:
```bash
# in ./BattleGo/Backend
npm install express dotenv
nodemon server.js
```
Then, add a `.env` file to the repository and add the following into the file
```bash
PORT = 2901
SECRET_PLAYER_KEY = <literally, anything. Perhaps number, e.g., 34234327>
SECRET_ADMIN_KEY = <literally, anything. Perhaps number, e.g., 1823423>
# do not type the bracket '<', '>'
```
Afterwards, the program will be running at `localhost:2901`, where the frontend React app will fetch data from. Note that if issues occur when using `.env` files, feel free to remove them as keys such as `PORT` and others have also been hard-coded to accommmodate this potential compatibility error.

## Contributors
- Chan Chun Ming - 1155163257 (Server)
- Kyaw Shin Thant - 1155173026 (Game logics)
- Phutanate Pisutsin - 1155163440 (Backend)
- Oranuch Ekkowit - 1155168715 (Backend)
- Ho Chun Tou - 1155163338 (Frontend)

## Footnote
The UI has not been implemented to accommodate *Friend* feature. However, users may refer to API routing in `server.js` and test the API to send friend request in platform such as Postman or via `request.rest`. Friend request and friend list still can be viewed in the application.
