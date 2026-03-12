package com.example.back.controller;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.data.entity.EndSessionRequest;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/end")
    public ResponseEntity<?> endSession(@RequestBody EndSessionRequest request) {
        runningService.endSession(request.getSessionId());
        return ResponseEntity.ok().build();
    }
}
