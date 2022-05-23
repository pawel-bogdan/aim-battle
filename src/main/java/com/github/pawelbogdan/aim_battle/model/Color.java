package com.github.pawelbogdan.aim_battle.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Color {
    @JsonProperty("green")
    GREEN,
    @JsonProperty("yellow")
    YELLOW,
    @JsonProperty("red")
    RED,
    @JsonProperty("blue")
    BLUE
}
