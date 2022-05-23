let greenCrosshair = document.createElement('img');
greenCrosshair.src = 'images/crosshair_green.png';
greenCrosshair.classList.add('crosshair');

let blueCrosshair = document.createElement('img');
blueCrosshair.src = 'images/crosshair_blue.png';
blueCrosshair.classList.add('crosshair');

let redCrosshair = document.createElement('img');
redCrosshair.src = 'images/crosshair_red.png';
redCrosshair.classList.add('crosshair');

let yellowCrosshair = document.createElement('img');
yellowCrosshair.src = 'images/crosshair_yellow.png';
yellowCrosshair.classList.add('crosshair');

let audio = new Audio('audio/shot.mp3');

let [seconds, minutes] = [60, 0];
let timerRef = document.getElementById("clock");
let time = null;

document.getElementById('submitPlayer').onclick = displayRooms;
document.getElementById('createRoom').onclick = createRoom;
document.getElementById('startGame').onclick = startGame;

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

connect();
document.getElementById('gamePanel').onmousemove = updateMousePosition;
readAllActualRooms();

function displayRooms() {
    player = document.getElementById('nickInput').value;
    document.getElementById('nick').style.display = 'none';
    document.getElementById('rooms').style.display = 'block';
}

function connect() {
    let socket = new SockJS("/aim-battle");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        stompClient.subscribe('/rooms/player-joined', function (room) {
            let roomObj = JSON.parse(room.body);
            if (roomObj.id == currentRoomId) {
                document.getElementById('listOfPlayers').innerHTML = "";
                let playersMap = new Map(Object.entries(roomObj.players));

                const crosshairs = document.querySelectorAll('.crosshair');
                crosshairs.forEach(cross => {
                    cross.remove();
                });

                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.innerHTML = `${key} ${value.nick} <span id="${value.nick}Points">0</span>`;
                    document.getElementById('listOfPlayers').appendChild(playerElem);

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
            readAllActualRooms();
        });


        stompClient.subscribe('/rooms/created-rooms', function (room) {
            let roomElem = document.createElement('li');
            let roomObj = JSON.parse(room.body);

            if (roomObj.host.nick === player) {
                currentRoomId = roomObj.id;
                currentGameId = roomObj.id;
                stompClient.subscribe(`/games/game-start/${currentGameId}`, connectToGame);
                document.getElementById('rooms').style.display = 'none';
                document.getElementById('game').style.display = 'block';
            }
            roomElem.dataset['roomId'] = roomObj.id;
            roomElem.id=`roomList${roomObj.id}`;
            roomElem.classList.add('room');
            roomElem.innerHTML = `<p>Pokoj ${roomObj.id}. (${new Map(Object.entries(roomObj.players)).size} / 4) </p> 
           <button type="button" id="room${roomObj.id}" room-id="${roomObj.id}" onclick="joinToRoom(${roomObj.id})">DOŁĄCZ</button>`;
            document.getElementById('roomList').appendChild(roomElem);
            if (currentRoomId === roomObj.id) {
                let playersMap = new Map(Object.entries(roomObj.players));
                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.innerHTML = `${key} ${value.nick} <span id="${value.nick}Points">0</span>`;
                    document.getElementById('listOfPlayers').appendChild(playerElem);
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
    //let audio = new Audio('audio/shot.mp3');
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

function updateMousePosition(evn) {
    stompClient.send(`/game/mouse-position/game${currentGameId}`, {},
        JSON.stringify({player: `${player}`, color: currentColor, xLocation: evn.offsetX, yLocation: evn.offsetY}));
}

async function joinToRoom(roomId) {
    currentRoomId = roomId;
    currentGameId = roomId;
    let playersMap = null;
    document.getElementById('rooms').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    await fetch(`/aim-battle/rooms/${roomId}`).then(response => response.json()).then(data => {
        playersMap = new Map(Object.entries(data.players));
        currentColor = colors.get(playersMap.size + 1);
        document.getElementById("gamePanel").classList.add(`${currentColor}Player`);
    });
    stompClient.send(`/game/player-join/${roomId}`, {}, JSON.stringify(player));
    stompClient.subscribe(`/games/game-start/${currentGameId}`, connectToGame);
}


function startGame() {
    document.getElementById('startGame').style.display = 'none';
    //  /game${gameId}/start
    stompClient.send(`/game/game-start/${currentGameId}`);
    stompClient.send(`/game/disable-room/${currentGameId}`);
    setTimeout(addTarget, 2000);
    time = setInterval(displayTimer, 1000);
}

function finishGame() {

}

function displayTimer() {

    seconds -= 1;

    if (seconds == 0 && minutes == 0) {
        timerRef.innerHTML = `00 : 00`;
        clearInterval(time);
        finishGame();
    } else {

        if (seconds == 60) {
            minutes--;
        }
        if (seconds == 0) {
            seconds = 59;
        }

        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        timerRef.innerHTML = `${m} : ${s}`;
    }
}

function connectToGame() {

    stompClient.subscribe(`/targets/removed-target/game${currentGameId}`, function (target) {
        document.getElementById(`${target.body}`).remove();
    });

    stompClient.subscribe(`/targets/added-target/game${currentGameId}`, function (target) {
        let targetElem = document.createElement('div');
        targetElem.id = `target${JSON.parse(target.body).id}`;
        targetElem.classList.add('target');
        targetElem.classList.add(`${currentColor}Player`);
        targetElem.style.left = `${JSON.parse(target.body).xLocation}%`;
        targetElem.style.top = `${JSON.parse(target.body).yLocation}%`;
        targetElem.addEventListener('click', removeTarget);
        document.getElementById('gamePanelWrapper').appendChild(targetElem);
    });

    stompClient.subscribe(`/mouse-position/update/game${currentGameId}`, function (mousePosition) {
        let obj = JSON.parse(mousePosition.body);
        if (obj.player !== player) {
            if (obj.color === 'green') {
                greenCrosshair.style.left = `${obj.xLocation}px`;
                greenCrosshair.style.top = `${obj.yLocation}px`;
            }
            if (obj.color === 'blue') {
                blueCrosshair.style.left = `${obj.xLocation}px`;
                blueCrosshair.style.top = `${obj.yLocation}px`;
            }
            if (obj.color === 'red') {
                redCrosshair.style.left = `${obj.xLocation}px`;
                redCrosshair.style.top = `${obj.yLocation}px`;
            }
            if (obj.color === 'yellow') {
                yellowCrosshair.style.left = `${obj.xLocation}px`;
                yellowCrosshair.style.top = `${obj.yLocation}px`;
            }

        }
    });

    stompClient.subscribe(`/points/update/game${currentGameId}`, function (pointsMap) {
        let currentsPointsMap = new Map(Object.entries(JSON.parse(pointsMap.body)));

        for (const [key, value] of currentsPointsMap.entries()) {
            document.getElementById(`${key}Points`).textContent = value;
        }

    });
}

function createRoom() {
    stompClient.send("/game/create-room", {}, JSON.stringify(player));
    currentColor = 'green';
    document.getElementById("gamePanel").classList.add(`greenPlayer`);
    document.getElementById('startGame').style.display = 'block';
}

function readAllActualRooms() {
    fetch(`/aim-battle/rooms`).then(response => response.json()).then(data => {
        document.getElementById('roomList').innerHTML = "";
        let roomListElem = document.getElementById('roomList');
        data.forEach(room => {
            let roomElem = document.createElement('li');
            roomElem.dataset['roomId'] = room.id;
            roomElem.id=`roomList${room.id}`;
            roomElem.classList.add('room');
            roomElem.innerHTML = `<p>Pokoj ${room.id}. (${new Map(Object.entries(room.players)).size} / 4) </p> 
           <button type="button" id="room${room.id}" room-id="${room.id}" onclick="joinToRoom(${room.id})">DOŁĄCZ</button>`;
            roomListElem.appendChild(roomElem);
            if (new Map(Object.entries(room.players)).size === 4) {
                document.getElementById(`room${room.id}`).disabled = true;
            }
        });
    });
}