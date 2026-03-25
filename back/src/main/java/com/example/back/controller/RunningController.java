package com.example.back.controller;

import com.example.back.data.dto.EndSessionRequestDto;
import com.example.back.data.dto.LocationRequestDto;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;
import com.example.back.data.entity.RunSession;

import java.util.Map;

@RestController
@RequestMapping("/api/running")
@RequiredArgsConstructor
public class RunningController {
    private final RunningServiceImpl runningService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @PostMapping(path = "/startLocation")
    public RunSession getStartLocation(@RequestBody LocationRequestDto start){
        return runningService.makeSession(start);
    }

    @PostMapping("/location")
    public void saveLocation(@RequestBody LocationRequestDto dto){
        // 핵심: sessionId를 Key로 줘서 순서 보장(Ordering)
        kafkaTemplate.send("running-locations", String.valueOf(dto.getSessionId()), dto);
    }

    @GetMapping("/session/{id}")
    public Map<Object, Object> getSession(@PathVariable("id") Long id){
        // 이제 실시간 데이터는 DB가 아니라 Redis에서 가져옴
        return runningService.getRealTimeStatus(id);
    }

    @PostMapping("/end")
    public ResponseEntity<?> endSession(@RequestBody EndSessionRequestDto request) {
        runningService.endSession(request.getSessionId());
        return ResponseEntity.ok().build();
    }
}
