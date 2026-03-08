package com.example.back.controller;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.example.back.data.entity.RunSession;

@RestController
@RequestMapping("/api/running")
@RequiredArgsConstructor
public class RunningController {
    private final RunningServiceImpl runningService;

    @PostMapping(path = "/startLocation")
    public RunSession getStartLocation(@RequestBody LocationRequestDto start){
        return runningService.makeSession(start);
    }

    @GetMapping("/session/{id}")
    public RunSession getSession(@PathVariable("id") Long id){
        return runningService.getSession(id);
    }

    @PostMapping("/location")
    public void saveLocation(@RequestBody LocationRequestDto dto){
        System.out.println("Location saved: " + dto.getLatitude() + ", " + dto.getLongitude());
        runningService.saveLocation(dto);
    }

    @PostMapping("/end") // 완주하면 완주 세션을 세팅한다.
    public RunSession endSession(@RequestBody Long sessionId){
        return runningService.endSession(sessionId);
    }
}
