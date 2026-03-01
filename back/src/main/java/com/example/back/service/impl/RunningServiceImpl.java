package com.example.back.service.impl;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.data.entity.RunLocation;
import com.example.back.data.entity.RunSession;
import com.example.back.data.repository.LocationRepository;
import com.example.back.data.repository.SessionRepository;
import com.example.back.service.RunningService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RunningServiceImpl implements RunningService {
        private final SessionRepository sessionRepository;
        private final LocationRepository locationRepository;

        public void saveLocation(LocationRequestDto dto) {

            RunSession session = sessionRepository.findById(dto.getSessionId())
                    .orElseThrow(() -> new RuntimeException("Session not found"));

            RunLocation location = new RunLocation();
            location.setLatitude(dto.getLatitude());
            location.setLongitude(dto.getLongitude());
            location.setTimeStamp(dto.getTimeStamp());
            location.setSession(session);

            locationRepository.save(location);
        }
}
