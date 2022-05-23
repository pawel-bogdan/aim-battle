package com.github.pawelbogdan.aim_battle.model;

@SuppressWarnings("unused") // jackson ...
public class Player {
    private String nick;

    public Player(String nick) {
        this.nick = nick;
    }
    public String getNick() {
        return nick;
    }

    @Override
    public String toString() {
        return "Player{" +
                "nick='" + nick + '\'' +
                '}';
    }
}
