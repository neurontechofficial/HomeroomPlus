package com.homeroomplus.backend.repository;

import com.homeroomplus.backend.model.BehaviorRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BehaviorRecordRepository extends JpaRepository<BehaviorRecord, Long> {
}
