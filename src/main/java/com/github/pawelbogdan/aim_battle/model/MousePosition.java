package com.github.pawelbogdan.aim_battle.model;

public class MousePosition {
    private String player;
    private int xLocation;
    private int yLocation;

    public MousePosition(String player, int xLocation, int yLocation) {
        this.player = player;
        this.xLocation = xLocation;
        this.yLocation = yLocation;
    }

    public String getPlayer() {
        return player;
    }

    void setPlayer(String player) {
        this.player = player;
    }

    public int getxLocation() {
        return xLocation;
    }

    void setxLocation(int xLocation) {
        this.xLocation = xLocation;
    }

    public int getyLocation() {
        return yLocation;
    }

    void setyLocation(int yLocation) {
        this.yLocation = yLocation;
    }

    @Override
    public String toString() {
        return "MousePosition{" +
                "player='" + player + '\'' +
                ", xLocation=" + xLocation +
                ", yLocation=" + yLocation +
                '}';
    }
}
