package com.example.back.controller;

import com.example.back.data.dto.EndSessionRequestDto;
import com.example.back.data.dto.LocationRequestDto;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.back.data.entity.RunSession;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;

@RestController
@RequestMapping("/api/running")
//@RequiredArgsConstructor
public class RunningController {
    private final RunningServiceImpl runningService;
    private final Timer rdbTimer;

    public RunningController(RunningServiceImpl runningService, MeterRegistry meterRegistry) {
        this.runningService = runningService;
        // 'rdb_save_location'이라는 이름으로 프로메테우스에 등록됩니다.
        this.rdbTimer = meterRegistry.timer("rdb_save_location");
    }

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
        //System.out.println("Location saved: " + dto.getLatitude() + ", " + dto.getLongitude());
        //runningService.saveLocation(dto);

        System.out.println("받은 데이터: " + dto.getSessionId());

        // 3. 선언한 rdbTimer를 사용해서 기록!
        rdbTimer.record(() -> {
            try {
                runningService.saveLocation(dto);
            } catch (Exception e) {
                // DB가 터져도 기록은 남깁니다 (Before 데이터 확보용)
                System.err.println("저장 실패했지만 기록은 합니다: " + e.getMessage());
            }
        });
    }

    @PostMapping("/end")
    public ResponseEntity<?> endSession(@RequestBody EndSessionRequestDto request) {
        runningService.endSession(request.getSessionId());
        return ResponseEntity.ok().build();
    }
}
