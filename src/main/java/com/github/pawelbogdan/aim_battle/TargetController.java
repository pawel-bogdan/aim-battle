package com.github.pawelbogdan.aim_battle;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TargetController {

    @MessageMapping("/remove-target")
    @SendTo("/removed-target")
    public int removeTarget(int targetID) {
        return targetID;
    }
}
