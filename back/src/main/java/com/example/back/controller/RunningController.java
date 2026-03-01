package com.example.back.controller;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import com.example.back.data.entity.RunSession;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/running")
@RequiredArgsConstructor
public class RunningController {
    private final RunningServiceImpl runningService;

    @PostMapping(path = "/startLocation")
    public RunSession getStartLocation(@RequestBody LocationRequestDto start){
        return runningService.makeSession(start);
    }

    @PostMapping("/location")
    public void saveLocation(@RequestBody LocationRequestDto dto){
        runningService.saveLocation(dto);
    }
}
