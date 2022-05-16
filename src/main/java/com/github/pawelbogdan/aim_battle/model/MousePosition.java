package com.github.pawelbogdan.aim_battle.model;

@SuppressWarnings("unused") // jackson needs public getters
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

    public int getxLocation() {
        return xLocation;
    }

    public int getyLocation() {
        return yLocation;
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
