let ranking = document.getElementById('ranking');
let players = [{nick: "pelo", points: 1230}, {nick: "gocek", points: 1210}, {nick: "kondi", points: 970},
    {nick: "franek__22", points: 230}, {nick: "pelo", points: 110}];

/*for(let i = 0; i < players.length; i++) {
    ranking.appendChild(createRankPlace(i + 1, players[i]));
}*/


function createRankPlace(placeNum, player) {
    let result = document.createElement('div');
    result.classList.add('rankPlace');
    result.innerHTML = `<p>${placeNum}</p> <p>${player.nick}  </p> <p>${player.points}</p>`;
    return result;
}