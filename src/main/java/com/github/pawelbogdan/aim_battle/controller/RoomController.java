package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.model.Room;
import com.github.pawelbogdan.aim_battle.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class RoomController {

    @Autowired
    private RoomService roomService;
    private static Room mock = new Room(new Player("player1"));

    @MessageMapping("/player-join")
    @SendTo("/rooms/player-joined")
    public Room add(Player player) {
        mock.add(player);
        return mock;
    }

    @MessageMapping("/create-room")
    @SendTo("/rooms/created-rooms")
    public Room createRoom(Player player){
        return roomService.createRoom(player);
    }
}
