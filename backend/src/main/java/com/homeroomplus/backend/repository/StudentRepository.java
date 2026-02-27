package com.homeroomplus.backend.repository;

import com.homeroomplus.backend.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    List<Student> findByClassroom_Id(Long classroomId);
}
