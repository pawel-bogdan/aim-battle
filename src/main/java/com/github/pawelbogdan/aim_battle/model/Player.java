package com.github.pawelbogdan.aim_battle.model;

@SuppressWarnings("unused") // jackson ...
public class Player {
    private String nick;
    private int points;

    public Player(String nick) {
        this.nick = nick;
        this.points = 0;
    }

    public String getNick() {
        return nick;
    }

    public int getPoints() {
        return points;
    }

    @Override
    public String toString() {
        return "Player{" +
                "nick='" + nick + '\'' +
                ", points=" + points +
                '}';
    }
}
