package com.github.pawelbogdan.aim_battle.service;

import com.github.pawelbogdan.aim_battle.model.Target;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Random;

@Service
public class TargetService {
    public int solution(int[] A) {
        // write your code in Java SE 8
        HashSet<Integer> set = new HashSet<>();
        for(int i = 0; i < A.length; i++) {
            if(!set.contains(A[i]))
                set.add(A[i]);
        }
        for(int i = 1; i < 1000000; i++) {
            if(!set.contains(i))
                return i;
        }
        return 1000000;
    }

    private Random random = new Random();

    public Target createTarget() {
        return new Target(random.nextInt(90), random.nextInt(90));
    }
}
