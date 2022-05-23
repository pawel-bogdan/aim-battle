package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.service.TargetService;
import com.github.pawelbogdan.aim_battle.model.Target;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TargetController {

    private TargetService targetService;

    public TargetController(TargetService targetService) {
        this.targetService = targetService;
    }

    @MessageMapping("/remove-target/game{gameId}")
    @SendTo("/targets/removed-target/game{gameId}")
    public String removeTarget(@DestinationVariable int gameId, String targetID) {
        return targetID;
    }

    @MessageMapping("/add-target/game{gameId}")
    @SendTo("/targets/added-target/game{gameId}")
    public Target addTarget(@DestinationVariable int gameId) {
        return targetService.createTarget();
    }
}
