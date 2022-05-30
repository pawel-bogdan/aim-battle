const SUBMIT_PLAYER_BTN = document.getElementById('submitPlayer');
const CREATE_ROOM_BTN = document.getElementById('createRoom');
const START_GAME_BTN = document.getElementById('startGameBtn');
const GAME_PANEL = document.getElementById('gamePanel');
const LOGIN_BTN = document.getElementById('login');

let greenCrosshair;
let blueCrosshair;
let redCrosshair;
let yellowCrosshair;
initCrosshairs();
let secondsLeft = 10;
let [seconds, minutes] = [20, 0];
let timerRef = document.getElementById("clock");
let time = null;
let countdown = null;
let currentColor = null;
let currentRoomId = null;
let stompClient = null;
let player = null;
let currentGameId = null;
let colors = new Map([
    [1, 'green'],
    [2, 'blue'],
    [3, 'red'],
    [4, 'yellow']
]);
let gameStartSubscription;
let removeTargetSubscription;
let addTargetSubscription;
let mpUpdateSubscription;
let pointsUpdateSubscription;

LOGIN_BTN.onclick = displayLoginForm;
SUBMIT_PLAYER_BTN.onclick = displayRooms;
CREATE_ROOM_BTN.onclick = createRoom;
START_GAME_BTN.onclick = startGame;
GAME_PANEL.onmousemove = updateMousePosition;


async function displayLoginForm() {
    document.location = '/loginsss';
    /*await fetch('/login', {
        mode: 'no-cors'
    });*/
    /*document.getElementById('mainPageInfo').style.display = 'none';
    document.getElementById('nick').style.display = 'block';
    connectToServer();
    readAllActualRooms();*/
}

function displayRooms() {
    player = document.getElementById('nickInput').value;
    document.getElementById('nick').style.display = 'none';
    document.getElementById('rooms').style.display = 'block';
}

function createRoom() {
    stompClient.send("/game/create-room", {}, JSON.stringify(player));
    currentColor = 'green';
    document.getElementById("gamePanel").removeAttribute('class');
    document.getElementById("gamePanel").classList.add(`greenPlayer`);
    document.getElementById('startGameBtn').style.display = 'block';
}

async function startGame() {
    document.getElementById('startGameBtn').style.display = 'none';
    stompClient.send(`/game/game-start/${currentGameId}`);
    stompClient.send(`/game/disable-room/${currentGameId}`);

}

function countDown() {
    const countDownDiv = document.createElement('div');
    countDownDiv.id = `countdowndiv${currentRoomId}`;
    countDownDiv.classList.add('countdown');
    countDownDiv.innerHTML = `<span id="countdown${currentRoomId}">10</span>`

    secondsLeft = 10;
    document.getElementById('gamePanel').appendChild(countDownDiv);
    countdown = setInterval(countdownTimer, 1000)
}

function countdownTimer() {
    secondsLeft--;
    if (secondsLeft == 0) {
        clearInterval(countdown);
        document.getElementById(`countdowndiv${currentRoomId}`).remove();
        connectToGame();
    } else {
        document.getElementById(`countdown${currentRoomId}`).textContent = `${secondsLeft}`;
    }
}

function updateMousePosition(evn) {
    stompClient.send(`/game/mouse-position/game${currentGameId}`, {},
        JSON.stringify({player: `${player}`, color: currentColor, xLocation: evn.offsetX, yLocation: evn.offsetY}));
}

function connectToServer() {
    let socket = new SockJS('/aim-battle');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function () {
        stompClient.subscribe('/rooms/player-joined', function (room) {
            let roomObj = JSON.parse(room.body);
            if (roomObj.id == currentRoomId) {
                document.getElementById('playersInRoom').innerHTML = "";
                let playersMap = new Map(Object.entries(roomObj.players));
                const crosshairs = document.querySelectorAll('.opponentCrosshair');
                crosshairs.forEach(cross => {
                    cross.remove();
                });
                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.classList.add('playerInfo');
                    let squareColor = 'green';
                    if (key === 'blue')
                        squareColor = 'blue';
                    else if (key === 'red')
                        squareColor = 'red';
                    else if (key === 'yellow')
                        squareColor = 'yellow';
                    playerElem.innerHTML = `<div class="playerWrapper"><div class="colorSquare" style="background-color: ${squareColor};"></div>${value.nick}</div> <span id="${value.nick}Points">0</span>`;
                    document.getElementById('playersInRoom').appendChild(playerElem);

                    if (currentColor !== key.toLowerCase()) {
                        if (key.toLowerCase() === 'green') {
                            document.getElementById('gamePanelWrapper').appendChild(greenCrosshair);
                        }
                        if (key.toLowerCase() === 'blue') {
                            document.getElementById('gamePanelWrapper').appendChild(blueCrosshair);
                        }
                        if (key.toLowerCase() === 'red') {
                            document.getElementById('gamePanelWrapper').appendChild(redCrosshair);
                        }
                        if (key.toLowerCase() === 'yellow') {
                            document.getElementById('gamePanelWrapper').appendChild(yellowCrosshair);
                        }
                    }
                }
            }

            if (new Map(Object.entries(roomObj.players)).size === 4) {
                document.getElementById(`room${roomObj.id}`).disabled = true;
            }
            readAllActualRooms(); // to nie ma sensu
        });


        stompClient.subscribe('/rooms/created-rooms', function (room) {
            let roomElem = document.createElement('li');
            let roomObj = JSON.parse(room.body);

            if (roomObj.host.nick === player) {
                currentRoomId = roomObj.id;
                currentGameId = roomObj.id;
                gameStartSubscription = stompClient.subscribe(`/games/game-start/${currentGameId}`, countDown);
                document.getElementById('rooms').style.display = 'none';
                document.getElementById('game').style.display = 'block';
            }
            roomElem.dataset['roomId'] = roomObj.id;
            roomElem.id = `roomList${roomObj.id}`;
            roomElem.classList.add('room');
            roomElem.innerHTML = `<p>Pokoj ${roomObj.id}. (${new Map(Object.entries(roomObj.players)).size} / 4) 
<button type="button" id="room${roomObj.id}" room-id="${roomObj.id}" class="btn btn-light btn-sm" onclick="joinToRoom(${roomObj.id})">DOŁĄCZ</button></p>`;
            document.getElementById('roomList').appendChild(roomElem);
            if (currentRoomId === roomObj.id) {
                let playersMap = new Map(Object.entries(roomObj.players));
                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.classList.add('playerInfo');
                    playerElem.innerHTML = `<div class="playerWrapper"><div class="colorSquare" style="background-color: green;"></div>${value.nick}</div> <span id="${value.nick}Points">0</span>`;
                    document.getElementById('playersInRoom').appendChild(playerElem);
                }
            }
        });

        stompClient.subscribe('/rooms/disabled-room', function (roomId) {
            let roomNr = JSON.parse(roomId.body);
            document.getElementById(`roomList${roomNr}`).remove();
        });

    });
}

function removeTarget(evn) {
    let audio = new Audio('audio/shot.mp3');
    audio.play();
    stompClient.send(`/game/remove-target/game${currentGameId}`, {}, evn.target.id);
    addTarget();
    refreshPoints();
}

function addTarget() {
    stompClient.send(`/game/add-target/game${currentGameId}`, {}, 5);
}

function refreshPoints() {
    stompClient.send(`/game/points/game${currentGameId}`, {}, JSON.stringify(currentColor));
}

async function joinToRoom(roomId) {
    currentRoomId = roomId;
    currentGameId = roomId;
    let playersMap = null;
    document.getElementById('rooms').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    await fetch(`/aim-battle/rooms/${roomId}`, {
        mode: 'no-cors'
    }).then(response => response.json()).then(data => {
        playersMap = new Map(Object.entries(data.players));
        currentColor = colors.get(playersMap.size + 1);
        document.getElementById("gamePanel").removeAttribute('class');
        document.getElementById("gamePanel").classList.add(`${currentColor}Player`);
    });
    stompClient.send(`/game/player-join/${roomId}`, {}, JSON.stringify(player));
    gameStartSubscription = stompClient.subscribe(`/games/game-start/${currentGameId}`, countDown);
}

async function finishGame() {
    document.querySelectorAll('.opponentCrosshair').forEach(cross => cross.remove());
    document.querySelectorAll('.target').forEach(t => t.remove());
    console.log(currentColor, gameStartSubscription, removeTargetSubscription, addTargetSubscription, mpUpdateSubscription, pointsUpdateSubscription)
    gameStartSubscription.unsubscribe();
    removeTargetSubscription.unsubscribe();
    addTargetSubscription.unsubscribe();
    mpUpdateSubscription.unsubscribe();
    pointsUpdateSubscription.unsubscribe();
    let place = 1;
    const scoreBoard = document.getElementById("score");
    document.getElementById("scoreBoard").style.display = 'block';
    await fetch(`/aim-battle/games/${currentGameId}/score`, {
        mode: 'no-cors'
    }).then(response => response.json())
        .then(data => {
            console.log("Dane ", data);

            data.forEach(pair => {
                let playerPosition = document.createElement('li');
                playerPosition.innerHTML = `${place}.                   ${pair.value0.nick}        <span>${pair.value1}</span>`
                scoreBoard.appendChild(playerPosition);
                place = place + 1;
            })

        });

    setTimeout(deleteGame, 10000);
}

async function deleteGame() {
    if (currentColor === 'green') {
        console.log("wysylanie reqs");
        await fetch(`/aim-battle/games/${currentGameId}`, {
            mode: 'no-cors',
            method: 'DELETE'}
        ).then(response => response.json())
            .then(data => {
                console.log(data);
            });

        await fetch(`/aim-battle/rooms/${currentRoomId}`, {
            mode: 'no-cors',
            method: 'DELETE'}
        ).then(response => response.json())
            .then(data => {
                console.log(data);
            });
    }
    console.log("usuwam gre");
    document.getElementById('score').innerHTML = "";
    document.getElementById('playersInRoom').innerHTML = "";
    document.getElementById('clock').innerHTML = '01 : 00';
    document.getElementById('game').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'none';
    document.getElementById('rooms').style.display = 'block';
    [seconds, minutes] = [20, 0];
    await readAllActualRooms();
}

function displayTimer() {
    seconds--;
    if (seconds == 0 && minutes == 0) {
        timerRef.innerHTML = `00:00`;
        clearInterval(time);
        finishGame();
    } else {
        if (seconds == 60)
            minutes--;
        if (seconds == 0)
            seconds = 59;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;
        timerRef.innerHTML = `${m}:${s}`;
    }
}

function connectToGame() {

    // to jest potrzebne by po najechaniu na przeciwnika nie pojawial sie zwykly kursor
    greenCrosshair.removeAttribute('class');
    greenCrosshair.classList.add(`opponentCrosshair`);
    greenCrosshair.classList.add(`${currentColor}Player`);

    blueCrosshair.removeAttribute('class');
    blueCrosshair.classList.add(`opponentCrosshair`);
    blueCrosshair.classList.add(`${currentColor}Player`);

    redCrosshair.removeAttribute('class');
    redCrosshair.classList.add(`opponentCrosshair`);
    redCrosshair.classList.add(`${currentColor}Player`);

    yellowCrosshair.removeAttribute('class');
    yellowCrosshair.classList.add(`opponentCrosshair`);
    yellowCrosshair.classList.add(`${currentColor}Player`);

    removeTargetSubscription = stompClient.subscribe(`/targets/removed-target/game${currentGameId}`, function (target) {
        document.getElementById(`${target.body}`).remove();
    });

    addTargetSubscription = stompClient.subscribe(`/targets/added-target/game${currentGameId}`, function (target) {
        let targetElem = document.createElement('div');
        targetElem.id = `target${JSON.parse(target.body).id}`;
        targetElem.classList.add('target');
        targetElem.classList.add(`${currentColor}Player`);
        targetElem.style.left = `${JSON.parse(target.body).xLocation}%`;
        targetElem.style.top = `${JSON.parse(target.body).yLocation}%`;
        targetElem.addEventListener('click', removeTarget);
        document.getElementById('gamePanelWrapper').appendChild(targetElem);
    });

    mpUpdateSubscription = stompClient.subscribe(`/mouse-position/update/game${currentGameId}`, function (mousePosition) {
        let obj = JSON.parse(mousePosition.body);

        if (obj.player !== player) {

            if (obj.color === 'green') {
                greenCrosshair.style.left = `${obj.xLocation}px`;
                greenCrosshair.style.top = `${obj.yLocation}px`;
            } else if (obj.color === 'blue') {
                blueCrosshair.style.left = `${obj.xLocation}px`;
                blueCrosshair.style.top = `${obj.yLocation}px`;
            } else if (obj.color === 'red') {
                redCrosshair.style.left = `${obj.xLocation}px`;
                redCrosshair.style.top = `${obj.yLocation}px`;
            } else if (obj.color === 'yellow') {
                yellowCrosshair.style.left = `${obj.xLocation}px`;
                yellowCrosshair.style.top = `${obj.yLocation}px`;
            }

        }
    });

    pointsUpdateSubscription = stompClient.subscribe(`/points/update/game${currentGameId}`, function (pointsMap) {
        let currentsPointsMap = new Map(Object.entries(JSON.parse(pointsMap.body)));

        for (const [key, value] of currentsPointsMap.entries()) {
            document.getElementById(`${key}Points`).textContent = value;
        }

    });
    time = setInterval(displayTimer, 1000);
    if (currentColor == "green") {
        addTarget();
    }
}

function readAllActualRooms() {
    fetch(`/aim-battle/rooms`, {
        mode: 'no-cors'
    }).then(response => response.json()).then(data => {
        document.getElementById('roomList').innerHTML = "";
        let roomListElem = document.getElementById('roomList');
        data.forEach(room => {
            let roomElem = document.createElement('li');
            roomElem.dataset['roomId'] = room.id;
            roomElem.id = `roomList${room.id}`;
            roomElem.classList.add('room');
            roomElem.innerHTML = `<p>Pokoj ${room.id}. (${new Map(Object.entries(room.players)).size} / 4) 
<button type="button" id="room${room.id}" room-id="${room.id}" class="btn btn-light btn-sm" onclick="joinToRoom(${room.id})">DOŁĄCZ</button></p>`;
            roomListElem.appendChild(roomElem);
            if (new Map(Object.entries(room.players)).size === 4) {
                document.getElementById(`room${room.id}`).disabled = true;
            }
        });
    });
}

function initCrosshairs() {
    greenCrosshair = document.createElement('img');
    greenCrosshair.id = 'greenCrosshair';
    greenCrosshair.src = 'images/crosshair_green.png';
    greenCrosshair.classList.add('opponentCrosshair');

    blueCrosshair = document.createElement('img');
    blueCrosshair.id = 'blueCrosshair';
    blueCrosshair.src = 'images/crosshair_blue.png';
    blueCrosshair.classList.add('opponentCrosshair');


    redCrosshair = document.createElement('img');
    redCrosshair.id = 'redCrosshair';
    redCrosshair.src = 'images/crosshair_red.png';
    redCrosshair.classList.add('opponentCrosshair');

    yellowCrosshair = document.createElement('img');
    yellowCrosshair.id = 'yellowCrosshair';
    yellowCrosshair.src = 'images/crosshair_yellow.png';
    yellowCrosshair.classList.add('opponentCrosshair');

}