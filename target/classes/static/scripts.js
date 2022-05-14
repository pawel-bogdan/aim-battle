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
            console.log("Usuwanie punktu: " + target.body);
            document.getElementById(`${target.body}`).remove();
        });
        stompClient.subscribe('/targets/added-target', function (target) {
            console.log("Dodawanie punktu: " + target.body)
            let targetElem = document.createElement('div');
            targetElem.id = `target${JSON.parse(target.body).id}`;
            targetElem.classList.add('target');
            targetElem.style.left = `${JSON.parse(target.body).xLocation}%`;
            targetElem.style.top = `${JSON.parse(target.body).yLocation}%`;
            targetElem.addEventListener('click', removeTarget);
            document.getElementById('gamePanel').appendChild(targetElem);
        });
        stompClient.subscribe('/mouse-position/update', function (target) {
            console.log("hau");
            opponentCrosshair.style.left = `${JSON.parse(target.body).xLocation}px`;
            opponentCrosshair.style.top = `${JSON.parse(target.body).yLocation}px`;
        });
    });
}

function removeTarget(evn) {
    console.log("Removing: " + evn.target.id);
    let audio = new Audio('audio/shot.mp3');
    audio.play();
    stompClient.send("/game/remove-target", {}, evn.target.id);
    addTarget();
}

function addTarget() {
    console.log("Adding");
    stompClient.send("/game/add-target", {}, 5);
}

function updateMousePosition(evn) {
    stompClient.send("/game/mouse-position", {},
        JSON.stringify({player: "fisiu", xLocation: evn.offsetX, yLocation: evn.offsetY}));
}