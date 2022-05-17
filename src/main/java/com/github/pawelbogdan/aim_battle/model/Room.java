package com.github.pawelbogdan.aim_battle.model;

import java.util.*;

@SuppressWarnings("unused") // jackson needs public getters
public class Room {
    private static int generatedQueues = 0;
    private Player host;
    private int id;
    Map<Color, Player> players;

    public Room(Player host) {
        id = generatedQueues++;
        this.host = host;
        players = new LinkedHashMap<>(4);
        add(this.host);
    }

    public void add(Player player) {
        Color color;
        if(players.size() == 0)
            color = Color.GREEN;
        else if(players.size() == 1)
            color = Color.BLUE;
        else if(players.size() == 2)
            color = Color.RED;
        else
            color = Color.YELLOW;
        players.put(color, player);
    }

    public static int getGeneratedQueues() {
        return generatedQueues;
    }

    public int getId() {
        return id;
    }

    public LinkedHashMap<Color, Player> getPlayers() {
        return (LinkedHashMap<Color, Player>) players;
    }

    public Player getHost() {
        return host;
    }

    @Override
    public String toString() {
        return "Room{" +
                "id=" + id +
                ", players=" + players +
                '}';
    }
}
