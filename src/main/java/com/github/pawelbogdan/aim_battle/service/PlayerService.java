package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlayerService {
    private static List<Player> activePlayers;

    public PlayerService() {
        activePlayers = new ArrayList<>();
    }

    public void addActivePlayer(Player player) {
        activePlayers.add(player);
    }
}
