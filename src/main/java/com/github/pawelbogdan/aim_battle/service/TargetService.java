package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Target;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class TargetService {
    private Random random = new Random();

    public Target createTarget() {
        return new Target(random.nextInt(96) + 5, random.nextInt(96) + 5);
    }
}
