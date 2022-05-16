package com.github.pawelbogdan.aim_battle.controller;

import com.github.pawelbogdan.aim_battle.model.MousePosition;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MousePositionController {

    @MessageMapping("/mouse-position")
    @SendTo("/mouse-position/update")
    public MousePosition updatePosition(MousePosition mousePosition) {
        return mousePosition;
    }

}
