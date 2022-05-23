package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.Game;
import com.github.pawelbogdan.aim_battle.service.GameService;
import com.github.pawelbogdan.aim_battle.service.RoomService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GameController {
    private RoomService roomService;
    private GameService gameService;

    public GameController(RoomService roomService, GameService gameService) {
        this.roomService = roomService;
        this.gameService = gameService;
    }

    @MessageMapping("/game-start/{roomId}")
    @SendTo("/games/game-start/{roomId}")
    public Game createGame(@DestinationVariable int roomId) {
        var room = roomService.findById(roomId).get(); // tu trzeba bedzie tego geta wywalic i bledy obsluzyc
        Game game = new Game(room);
        gameService.createGame(game);
        return game;
    }
}
