package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Game;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {
    private static List<Game> activeGames = new ArrayList<>();

    public Optional<Game> findById(int id) {
        return activeGames.stream().filter(game -> game.getId() == id).findFirst();
    }

    public void createGame(Game game) {
        activeGames.add(game);
    }

    public List<Integer> getIdsSet(){
        List<Integer> idsSet = new ArrayList<>();
        for (Game g: activeGames){
            idsSet.add(g.getId());
        }
        return idsSet;
    }
}
