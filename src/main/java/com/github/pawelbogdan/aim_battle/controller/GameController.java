package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.Game;
import com.github.pawelbogdan.aim_battle.model.GameStatus;
import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.service.GameService;
import com.github.pawelbogdan.aim_battle.service.RoomService;
import org.javatuples.Pair;
import org.javatuples.Tuple;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

@Controller
@RestController
public class GameController {
    private RoomService roomService;
    private GameService gameService;

    public GameController(RoomService roomService, GameService gameService) {
        this.roomService = roomService;
        this.gameService = gameService;
    }

    @GetMapping("/aim-battle/games/{gameId}/score")
    public List<Pair<Player, Integer>> getGameScore(@PathVariable int gameId) {

        var points = gameService.findById(gameId).get().getPoints();
        List<Pair<Player, Integer>> list = new ArrayList<>();
        points.keySet().forEach(player -> list.add(Pair.with(player, points.get(player))));
        list.sort(Comparator.comparing(Pair::getValue1));
        Collections.reverse(list);
        return list;
    }

    @DeleteMapping("/aim-battle/games/{gameId}")
    public Game deleteGame(@PathVariable int gameId) {
        var result = gameService.removeGame(gameId);
        result.setGameStatus(GameStatus.FINISHED);
        return result;
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
