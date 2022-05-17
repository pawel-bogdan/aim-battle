package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.model.Room;
import com.github.pawelbogdan.aim_battle.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Controller
@RestController
public class RoomController {

    private static Room mock = new Room(new Player("player1"));
    private RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/aim-battle/rooms")
    public List<Room> readAllRooms() {
        System.out.println(roomService.findAll());
        return roomService.findAll();
    }

    @MessageMapping("/player-join/{roomId}") //https://stackoverflow.com/questions/27047310/path-variables-in-spring-websockets-sendto-mapping
    @SendTo("/rooms/player-joined")
    public Room add(@DestinationVariable int roomId, Player player) {
        var room = roomService.findById(roomId).get(); // at this moment we do not check whether that room really exists
        room.add(player);
        return room;
    }

    @MessageMapping("/create-room")
    @SendTo("/rooms/created-rooms")
    public Room createRoom(Player player){
        return roomService.createRoom(player);
    }
}
