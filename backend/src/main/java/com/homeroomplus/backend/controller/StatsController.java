package com.homeroomplus.backend.controller;

import com.homeroomplus.backend.repository.BehaviorRecordRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatsController {

    private final BehaviorRecordRepository behaviorRecordRepository;

    @GetMapping("/school")
    public SchoolStats getSchoolStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).withHour(0)
                .withMinute(0).withSecond(0);
        LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0)
                .withSecond(0);

        SchoolStats stats = new SchoolStats();

        stats.setAllTimePositives(behaviorRecordRepository.sumAllPositivePoints());
        stats.setAllTimeNegatives(Math.abs(behaviorRecordRepository.sumAllNegativePoints()));

        stats.setThisMonthPositives(behaviorRecordRepository.sumPositivePointsSince(startOfMonth));
        stats.setThisMonthNegatives(Math.abs(behaviorRecordRepository.sumNegativePointsSince(startOfMonth)));

        stats.setThisWeekPositives(behaviorRecordRepository.sumPositivePointsSince(startOfWeek));
        stats.setThisWeekNegatives(Math.abs(behaviorRecordRepository.sumNegativePointsSince(startOfWeek)));

        return stats;
    }

    @Data
    public static class SchoolStats {
        private int allTimePositives;
        private int allTimeNegatives;
        private int thisMonthPositives;
        private int thisMonthNegatives;
        private int thisWeekPositives;
        private int thisWeekNegatives;
    }
}
