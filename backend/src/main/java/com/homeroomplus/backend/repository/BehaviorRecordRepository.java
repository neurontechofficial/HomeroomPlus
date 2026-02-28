package com.homeroomplus.backend.repository;

import com.homeroomplus.backend.model.BehaviorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BehaviorRecordRepository extends JpaRepository<BehaviorRecord, Long> {

    @Query("SELECT COALESCE(SUM(b.points), 0) FROM BehaviorRecord b WHERE b.createdAt >= :since AND b.points > 0")
    int sumPositivePointsSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(b.points), 0) FROM BehaviorRecord b WHERE b.createdAt >= :since AND b.points < 0")
    int sumNegativePointsSince(LocalDateTime since);

    @Query("SELECT COALESCE(SUM(b.points), 0) FROM BehaviorRecord b WHERE b.points > 0")
    int sumAllPositivePoints();

    @Query("SELECT COALESCE(SUM(b.points), 0) FROM BehaviorRecord b WHERE b.points < 0")
    int sumAllNegativePoints();
}
