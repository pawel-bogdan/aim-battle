package com.github.pawelbogdan.aim_battle;

import com.github.pawelbogdan.aim_battle.model.Target;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TargetController {

    private TargetService targetService;

    public TargetController(TargetService targetService) {
        this.targetService = targetService;
    }

    @MessageMapping("/remove-target")
    @SendTo("/targets/removed-target")
    public String removeTarget(String targetID) {
        return targetID;
    }

    @MessageMapping("/add-target")
    @SendTo("/targets/added-target")
    public Target addTarget(int x) {
        return targetService.createTarget();
    }
}
