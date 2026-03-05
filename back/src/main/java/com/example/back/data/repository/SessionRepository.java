package com.example.back.data.repository;

import com.example.back.data.entity.RunLocation;
import com.example.back.data.entity.RunSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<RunSession, Long> {
}
