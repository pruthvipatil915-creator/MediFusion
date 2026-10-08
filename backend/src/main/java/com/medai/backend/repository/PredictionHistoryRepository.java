package com.medai.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.medai.backend.entity.PredictionHistory;
import com.medai.backend.entity.User;

public interface PredictionHistoryRepository extends JpaRepository<PredictionHistory, Long> {

    List<PredictionHistory> findByUser(User user);
    List<PredictionHistory> findTop5ByUserOrderByPredictionDateDesc(User user);

    long countByUser(User user);

    Optional<PredictionHistory> findTopByUserOrderByPredictionDateDesc(User user);
    long countByUserAndDisease_RiskLevel(User user, String riskLevel);
}