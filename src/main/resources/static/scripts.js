/*let opponentCrosshair = document.createElement('img');
opponentCrosshair.src = 'images/crosshair_blue.png';
opponentCrosshair.classList.add('crosshair');
document.getElementById('gamePanelWrapper').appendChild(opponentCrosshair);*/

document.getElementById('submitPlayer').onclick = addToQueue;
let stompClient = null;
let player = null;
connect();
//setTimeout(addTarget, 2000);
document.getElementById('gamePanel').onmousemove = updateMousePosition;
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
            if(obj.player !== player) {
                opponentCrosshair.style.left = `${obj.xLocation}px`;
                opponentCrosshair.style.top = `${obj.yLocation}px`;
            }
        });
    });
}

function removeTarget(evn) {
    let audio = new Audio('audio/shot.mp3');
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

function addToQueue() {
    player = document.getElementById('nickInput').value;
    document.getElementById('nick').style.display = 'none';
    let playerInfo = document.createElement('p');
    playerInfo.innerHTML = player;
    document.getElementById('queue').style.display = 'block';
    document.getElementById('queue').appendChild(playerInfo);
}