package com.github.pawelbogdan.aim_battle.model;

public class Target {
    private static int generatedTargets = 0;
    private int id;
    private int xLocation;
    private int yLocation;

    public Target(int xLocation, int yLocation) {
        this.id = generatedTargets++;
        this.xLocation = xLocation;
        this.yLocation = yLocation;
    }

    public int getId() {
        return id;
    }

    void setId(int id) {
        this.id = id;
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
}
