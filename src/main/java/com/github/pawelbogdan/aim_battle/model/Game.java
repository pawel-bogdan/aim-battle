package com.github.pawelbogdan.aim_battle.model;

import java.util.HashMap;

public class Game {
    private static int generatedGames = 0;
    private int id;
    private HashMap<Player, Integer> points;

    public Game() {
        id = generatedGames++;
        points = new HashMap<>();
    }
}
