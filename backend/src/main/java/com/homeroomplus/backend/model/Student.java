package com.homeroomplus.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String avatarUrl;

    @Column
    private String studentEmail;

    @Column
    private String parentEmail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    @JsonIgnore
    private Classroom classroom;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BehaviorRecord> behaviorRecords = new ArrayList<>();

    // Virtual property for easier DB-free total mapping
    @Transient
    public int getTotalPoints() {
        if (behaviorRecords == null)
            return 0;
        return behaviorRecords.stream().mapToInt(BehaviorRecord::getPoints).sum();
    }
}
