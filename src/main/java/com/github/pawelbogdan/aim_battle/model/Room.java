package com.github.pawelbogdan.aim_battle.model;

import java.util.*;

public class Room {
    private static int generatedQueues = 0;
    private int id;
    HashMap<Color, Player> players;

    public Room() {
        id = generatedQueues++;
        players = new HashMap<>(4);
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
}
