package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Game;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private static List<Game> activeGames;

    public void addGame(Game game) {
        activeGames.add(game);
    }

    public Optional<Game> findById(int id) {
        return activeGames.stream().filter(game -> game.getId() == id).findFirst();
    }
}
