package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Player;
import com.github.pawelbogdan.aim_battle.model.Room;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomService {
    public static List<Room> roomList = new ArrayList<>();

    public Room createRoom(Player host) {
        Room newRoom = new Room(host);
        roomList.add(newRoom);
        return newRoom;
    }

    public List<Room> findAll() {
        return roomList;
    }

    public Optional<Room> findById(int id) {
        return roomList.stream().filter(room -> room.getId() == id).findFirst();
    }
}
