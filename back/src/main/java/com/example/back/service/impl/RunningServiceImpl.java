package com.example.back.service.impl;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.data.entity.RunLocation;
import com.example.back.data.entity.RunSession;
import com.example.back.data.repository.LocationRepository;
import com.example.back.data.repository.SessionRepository;
import com.example.back.service.RunningService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class RunningServiceImpl implements RunningService {
    private final SessionRepository sessionRepository;
    private final LocationRepository locationRepository;

    public RunSession makeSession(LocationRequestDto startLocation) {
        // 1. 새 세션 생성
        RunSession session = new RunSession();
        session.setStartTime(Instant.now());
        sessionRepository.save(session);

        // 2. 시작 위치 저장
        RunLocation loc = new RunLocation(
                startLocation.getLatitude(),
                startLocation.getLongitude(),
                startLocation.getTimeStamp()
        );
        loc.setSession(session);
        locationRepository.save(loc);

        return session;
    }
}
