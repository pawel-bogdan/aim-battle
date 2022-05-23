package com.github.pawelbogdan.aim_battle.model;

import java.util.HashMap;
import java.util.LinkedHashMap;

public class Game {
    private int id;
    private LinkedHashMap<Color, Player> players;
    private HashMap<Player, Integer> points;
    private GameStatus gameStatus;

    public Game(Room room) {
        id = room.getId();
        players = room.getPlayers();
        points = new HashMap<>();
        players.values().forEach(player -> points.put(player, 0));
        gameStatus = GameStatus.ACTIVE;
    }

    public int getId() {
        return id;
    }

    public LinkedHashMap<Color, Player> getPlayers() {
        return players;
    }

    public HashMap<Player, Integer> getPoints() {
        return points;
    }

    public GameStatus getGameStatus() {
        return gameStatus;
    }
}
