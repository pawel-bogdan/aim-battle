//let socket = new WebSocket("wss://localhost:8080/aim-battle");
let stompClient = null;
let opponentCrosshair = document.createElement('img');
opponentCrosshair.src = 'images/crosshair.png';
opponentCrosshair.classList.add('crosshair');
document.getElementById('gamePanel').appendChild(opponentCrosshair);

document.getElementById('gamePanel').onmousemove = updateMousePosition;


connect();
setTimeout(addTarget, 2000);
function connect() {
    let socket = new SockJS("/aim-battle");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
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
            document.getElementById('gamePanel').appendChild(targetElem);
        });
        stompClient.subscribe('/mouse-position/update', function (target) {
            console.log("Pozycja przed zmiana: ", opponentCrosshair.style.left, opponentCrosshair.style.top);
            opponentCrosshair.style.left = `${JSON.parse(target.body).xLocation}px`;
            opponentCrosshair.style.top = `${JSON.parse(target.body).yLocation}px`;
            console.log("Pozycja po zmianied: ", opponentCrosshair.style.left, opponentCrosshair.style.top);
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
        JSON.stringify({player: "foo", xLocation: evn.offsetX, yLocation: evn.offsetY}));
}