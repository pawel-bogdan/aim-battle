package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.Color;
import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.service.GameService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.HashMap;

@Controller
public class PointController {

    private GameService gameService;

    public PointController(GameService gameService) {
        this.gameService = gameService;
    }

    @MessageMapping("/points/game{gameId}")
    @SendTo("/points/update/game{gameId}")
    public HashMap<Player, Integer> updatePoints(@DestinationVariable int gameId, Color color) {
        var game = gameService.findById(gameId).get();
        var player = game.getPlayers().get(color);
        var pointsBeforeIncrementing = game.getPoints().get(player);
        game.getPoints().replace(player, pointsBeforeIncrementing + 10);
        return game.getPoints();
    }
}
