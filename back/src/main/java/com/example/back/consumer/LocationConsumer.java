package com.example.back.consumer;

import com.example.back.data.dto.LocationRequestDto;
import com.example.back.service.impl.RunningServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LocationConsumer {
    private final RunningServiceImpl runningService;

    @KafkaListener(topics = "running-locations", groupId = "running-group")
    public void consume(LocationRequestDto dto, Acknowledgment ack) {
        try {
            runningService.processLocationFromKafka(dto);
            ack.acknowledge(); // 성공 도장
        } catch (Exception e) {
            // 에러 로그 남기고 재시도 전략 등 고민 (면접 포인트)
            System.err.println("Error processing: " + e.getMessage());
        }
    }
}