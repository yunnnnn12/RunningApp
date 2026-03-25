package com.example.back.service.impl;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.data.entity.RunLocation;
import com.example.back.data.entity.RunSession;
import com.example.back.data.repository.LocationRepository;
import com.example.back.data.repository.SessionRepository;
import com.example.back.service.RunningService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RunningServiceImpl implements RunningService {
    private final SessionRepository sessionRepository;
    private final LocationRepository locationRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    // 1. 세션 시작 (DB & Redis 초기화)
    public RunSession makeSession(LocationRequestDto start) {
        RunSession session = new RunSession();
        session.setStartTime(Instant.now());
        sessionRepository.save(session);

        String redisKey = "run_session:" + session.getId();
        Map<String, Object> state = new HashMap<>();
        state.put("lat", start.getLatitude());
        state.put("lon", start.getLongitude());
        state.put("totalDist", 0.0);
        state.put("startTime", session.getStartTime().getEpochSecond());

        redisTemplate.opsForHash().putAll(redisKey, state);
        redisTemplate.expire(redisKey, Duration.ofHours(24));
        return session;
    }

    // 2. 카프카 전용 계산 로직 (Redis 기반)
    public void processLocationFromKafka(LocationRequestDto dto) {
        String redisKey = "run_session:" + dto.getSessionId();
        Map<Object, Object> lastState = redisTemplate.opsForHash().entries(redisKey);

        if (lastState.isEmpty()) return;

        double lastLat = (double) lastState.get("lat");
        double lastLon = (double) lastState.get("lon");
        double totalDist = (double) lastState.get("totalDist");
        long startTime = ((Number) lastState.get("startTime")).longValue();

        // 거리 계산
        double distance = calculateDistance(lastLat, lastLon, dto.getLatitude(), dto.getLongitude());
        totalDist += distance;

        // 페이스 계산
        double km = totalDist / 1000.0;
        double pace = (km > 0) ? (Instant.now().getEpochSecond() - startTime) / km : 0;

        // Redis 업데이트 (다음 계산용)
        Map<String, Object> newState = new HashMap<>();
        newState.put("lat", dto.getLatitude());
        newState.put("lon", dto.getLongitude());
        newState.put("totalDist", totalDist);
        newState.put("pace", pace);
        redisTemplate.opsForHash().putAll(redisKey, newState);

        // MySQL 기록 (경로 저장용 - 천천히 해도 됨)
        RunSession session = sessionRepository.getReferenceById(dto.getSessionId());
        locationRepository.save(new RunLocation(dto.getLatitude(), dto.getLongitude(), dto.getTimeStamp(), session));
    }

    // 3. 실시간 조회 (Redis에서 바로 쏨)
    public Map<Object, Object> getRealTimeStatus(Long sessionId) {
        return redisTemplate.opsForHash().entries("run_session:" + sessionId);
    }

    // 거리 계산 공식 (기존 소스 유지)
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    public RunSession endSession(Long sessionId) {
        // 1. DB에서 세션 객체 가져오기
        RunSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 2. 🔥 [핵심] Redis에 저장된 최종 성적표(누적 거리, 마지막 페이스) 가져오기
        String redisKey = "run_session:" + sessionId;
        Map<Object, Object> finalState = redisTemplate.opsForHash().entries(redisKey);

        if (!finalState.isEmpty()) {
            // Redis에 쌓인 최종 데이터를 DB 엔티티에 세팅
            double finalDistance = (double) finalState.get("totalDist");
            double finalPace = (double) finalState.get("pace");

            session.setTotalDistance(finalDistance);
            session.setAveragePace(finalPace);
        }

        // 3. 종료 시간 기록 및 저장
        session.setEndTime(Instant.now());
        RunSession savedSession = sessionRepository.save(session);

        // 4. 🔥 [청소] 다 썼으니까 Redis 데이터 삭제 (메모리 확보)
        redisTemplate.delete(redisKey);

        return savedSession;
    }
}