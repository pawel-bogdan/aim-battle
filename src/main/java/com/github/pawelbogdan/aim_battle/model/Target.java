package com.github.pawelbogdan.aim_battle.model;

@SuppressWarnings("unused") // jackson needs public getters
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

    public int getxLocation() {
        return xLocation;
    }

    public int getyLocation() {
        return yLocation;
    }
}
