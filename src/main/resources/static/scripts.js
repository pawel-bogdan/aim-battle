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

document.getElementById('submitPlayer').onclick = displayRooms;
document.getElementById('createRoom').onclick = createRoom;
document.getElementById('startGame').onclick = startGame;

let currentColor = null;
let currentRoomId = null;
let stompClient = null;
let player = null;

let colors = new Map([
    [1, 'green'],
    [2, 'blue'],
    [3, 'red'],
    [4, 'yellow']
]);

connect();
document.getElementById('gamePanel').onmousemove = updateMousePosition;
readAllActualRooms();

function connect() {
    let socket = new SockJS("/aim-battle");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {

        stompClient.subscribe('/targets/removed-target', function (target) {
            document.getElementById(`${target.body}`).remove();
        });

        stompClient.subscribe('/targets/added-target', function (target) {
            let targetElem = document.createElement('div');
            targetElem.id = `target${JSON.parse(target.body).id}`;
            targetElem.classList.add('target');
            targetElem.classList.add(`${currentColor}Player`);
            targetElem.style.left = `${JSON.parse(target.body).xLocation}%`;
            targetElem.style.top = `${JSON.parse(target.body).yLocation}%`;
            targetElem.addEventListener('click', removeTarget);
            document.getElementById('gamePanelWrapper').appendChild(targetElem);
        });

        stompClient.subscribe('/mouse-position/update', function (mousePosition) {
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

        stompClient.subscribe('/rooms/player-joined', function (room) {
            document.getElementById('listOfPlayers').innerHTML = "";
            let roomObj = JSON.parse(room.body);
            if (roomObj.id == currentRoomId) {
                let playersMap = new Map(Object.entries(roomObj.players));

                const crosshairs = document.querySelectorAll('.crosshair');
                crosshairs.forEach(cross => {
                    cross.remove();
                });

                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.innerHTML = `${key} ${value.nick}`;
                    document.getElementById('listOfPlayers').appendChild(playerElem);
                    console.log("powinien byc", currentColor);
                    if (currentColor !== key.toLowerCase()) {
                        console.log(key.toLowerCase());
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
                document.getElementById('rooms').style.display = 'none';
                document.getElementById('game').style.display = 'block';
            }
            roomElem.innerHTML = `<p>Pokoj ${roomObj.id}. (${new Map(Object.entries(roomObj.players)).size} / 4) </p> 
           <button type="button" id="room${roomObj.id}" room-id="${roomObj.id}" onclick="joinToRoom(${roomObj.id})">DOŁĄCZ</button>`;
            document.getElementById('roomList').appendChild(roomElem);

            let playersMap = new Map(Object.entries(roomObj.players));
            for (const [key, value] of playersMap.entries()) {
                let playerElem = document.createElement('li')
                playerElem.innerHTML = `${key} ${value.nick}`;
                document.getElementById('listOfPlayers').appendChild(playerElem);
            }
        });
    });
}

function removeTarget(evn) {
    audio.play();
    stompClient.send("/game/remove-target", {}, evn.target.id);
    addTarget();
}

function addTarget() {
    stompClient.send("/game/add-target", {}, 5);
}

function updateMousePosition(evn) {
    stompClient.send("/game/mouse-position", {},
        JSON.stringify({player: `${player}`, color: currentColor, xLocation: evn.offsetX, yLocation: evn.offsetY}));
}

function displayRooms() {
    player = document.getElementById('nickInput').value;
    document.getElementById('nick').style.display = 'none';
    document.getElementById('rooms').style.display = 'block';
}

function joinToRoom(roomId) {
    currentRoomId = roomId;
    let playersMap = null;
    document.getElementById('rooms').style.display = 'none';
    document.getElementById('game').style.display = 'block';

    fetch(`/aim-battle/rooms/${roomId}`).then(response => response.json()).then(data => {
        playersMap = new Map(Object.entries(data.players));
        currentColor = colors.get(playersMap.size);
        document.getElementById("gamePanel").classList.add(`${currentColor}Player`);
        console.log("tu", currentColor);
    });

    console.log("zzz", currentColor);
    joinToRoomWebSocket(roomId);
}
const sleep = (ms) => {
    return new Promise((resolve, reject) => setTimeout(resolve, ms));
};
function joinToRoomWebSocket(roomId){
    stompClient.send(`/game/player-join/${roomId}`, {}, JSON.stringify(player));
}

function startGame() {
    document.getElementById('startGame').style.display = 'none';
    setTimeout(addTarget, 2000);
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