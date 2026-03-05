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

    public void saveLocation(LocationRequestDto dto) {

        RunSession session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        RunLocation location = new RunLocation();
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());
        location.setTimeStamp(dto.getTimeStamp());
        location.setSession(session);

        locationRepository.save(location);

        System.out.println("Location saved: "
                + dto.getLatitude() + ", "
                + dto.getLongitude());
    }

    private double caculateDistance(double lat1, double lon1,
                                    double lat2, double lon2){
        double R = 6371000; // meter

        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat/2) * Math.sin(dLat/2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon/2) * Math.sin(dLon/2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }

    public RunSession endSession(Long sessionId) {

        RunSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(Instant.now()); // 완주 시간 기록

        long totalTime = session.getEndTime().getEpochSecond() - session.getStartTime().getEpochSecond();

        if (session.getTotalDistance() > 0) { // 평균 페이스 세팅
            double km = session.getTotalDistance() / 1000.0;
            double finalPace = totalTime / km;
            session.setAveragePace(finalPace);
        }

        return sessionRepository.save(session); // 새로운 세션 기록
    }
}
