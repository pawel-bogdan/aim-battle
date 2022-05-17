package com.github.pawelbogdan.aim_battle.model;

@SuppressWarnings("unused") // jackson needs public getters
public class MousePosition {
    private String player;
    private String color;
    private int xLocation;
    private int yLocation;

    public MousePosition(String player, String color, int xLocation, int yLocation) {
        this.color = color;
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

    public String getColor() {
        return color;
    }

    @Override
    public String toString() {
        return "MousePosition{" +
                "player='" + player + '\'' +
                ", color='" + color + '\'' +
                ", xLocation=" + xLocation +
                ", yLocation=" + yLocation +
                '}';
    }
}
