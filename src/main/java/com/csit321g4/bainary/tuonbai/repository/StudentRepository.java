package com.csit321g4.bainary.tuonbai.repository;

import com.csit321g4.bainary.tuonbai.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository
        extends JpaRepository<StudentEntity, Long> {
}
