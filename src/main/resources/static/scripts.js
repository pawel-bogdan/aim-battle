let opponentCrosshair = document.createElement('img');
opponentCrosshair.src = 'images/crosshair_blue.png';
opponentCrosshair.classList.add('crosshair');
document.getElementById('gamePanelWrapper').appendChild(opponentCrosshair);

let audio = new Audio('audio/shot.mp3');

document.getElementById('submitPlayer').onclick = displayRooms;
document.getElementById('createRoom').onclick = createRoom;
document.getElementById('startGame').onclick = startGame;

let currentRoomId = null;
let stompClient = null;
let player = null;
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
            targetElem.style.left = `${JSON.parse(target.body).xLocation}%`;
            targetElem.style.top = `${JSON.parse(target.body).yLocation}%`;
            targetElem.addEventListener('click', removeTarget);
            document.getElementById('gamePanelWrapper').appendChild(targetElem);
        });

        stompClient.subscribe('/mouse-position/update', function (mousePosition) {
            let obj = JSON.parse(mousePosition.body);
            if (obj.player !== player) {
                opponentCrosshair.style.left = `${obj.xLocation}px`;
                opponentCrosshair.style.top = `${obj.yLocation}px`;
            }
        });

        stompClient.subscribe('/rooms/player-joined', function (room) {
            let roomObj = JSON.parse(room.body);
            if(roomObj.id == currentRoomId) {
                let playersMap = new Map(Object.entries(roomObj.players));
                for (const [key, value] of playersMap.entries()) {
                    let playerElem = document.createElement('li')
                    playerElem.innerHTML = `${key} ${value.nick}`;
                    document.getElementById('listOfPlayers').appendChild(playerElem);
                }
            }
        });

        stompClient.subscribe('/rooms/created-rooms', function (room) {
            let roomElem = document.createElement('li');
            let roomObj = JSON.parse(room.body);
            if(roomObj.host.nick === player) {
                currentRoomId = roomObj.id;
                document.getElementById('game').style.display = 'block';
            }
            roomElem.innerHTML = `<p>Pokoj ${roomObj.id}. (${new Map(Object.entries(roomObj.players)).size} / 4) </p> 
           <button type="button" id="room${roomObj.id} room-id="${roomObj.id}" onclick="joinToRoom(${roomObj.id})">DOŁĄCZ</button>`;
            document.getElementById('roomList').appendChild(roomElem);

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
        JSON.stringify({player: `${player}`, xLocation: evn.offsetX, yLocation: evn.offsetY}));
}

function displayRooms() {
    player = document.getElementById('nickInput').value;
    document.getElementById('nick').style.display = 'none';
    document.getElementById('rooms').style.display = 'block';
}

function joinToRoom(roomId) {
    currentRoomId = roomId;
    document.getElementById('game').style.display = 'block';
    stompClient.send(`/game/player-join/${roomId}`, {}, JSON.stringify(player));
}

function startGame() {
    document.getElementById('startGame').style.display='none';
    setTimeout(addTarget, 2000);
}

function createRoom(){
    stompClient.send("/game/create-room", {}, JSON.stringify(player));
}

function readAllActualRooms() {
    fetch(`/aim-battle/rooms`).then(response => response.json()).then(data => {
        let roomListElem = document.getElementById('roomList');
        data.forEach(room => {
           let roomElem = document.createElement('li');
           roomElem.dataset['roomId'] = room.id;
           roomElem.classList.add('room');
           roomElem.innerHTML = `<p>Pokoj ${room.id}. (${new Map(Object.entries(room.players)).size} / 4) </p> 
           <button type="button" id="room${room.id} room-id="${room.id}" onclick="joinToRoom(${room.id})">DOŁĄCZ</button>`;
           roomListElem.appendChild(roomElem);
        });
    });
}