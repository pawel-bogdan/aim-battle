package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoomService {
    private final GameService gameService;

    public static List<Room> roomList = new ArrayList<>();

    public RoomService(GameService gameService) {
        this.gameService = gameService;
    }

    public Room createRoom(Player host) {
        Room newRoom = new Room(host);
        roomList.add(newRoom);
        return newRoom;
    }

    public Room removeRoom(int id) {
        var result = roomList.stream().filter(room -> room.getId() == id).findFirst().get();
        roomList.remove(result);
        return result;
    }

    public List<Room> findAll() {
        return roomList.stream().filter(room -> !(gameService.getIdsSet().contains(room.getId()))).collect(Collectors.toList());
    }

    public Optional<Room> findById(int id) {
        return roomList.stream().filter(room -> room.getId() == id).findFirst();
    }
}
