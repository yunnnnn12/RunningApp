package com.example.back.data.repository;

import com.example.back.data.entity.RunLocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<RunLocation, Long> {
}
