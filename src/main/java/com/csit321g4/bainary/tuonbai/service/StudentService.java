package com.csit321g4.bainary.tuonbai.service;

import com.csit321g4.bainary.tuonbai.entity.StudentEntity;
import com.csit321g4.bainary.tuonbai.repository.StudentRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // CREATE
    public StudentEntity postStudent(StudentEntity input) {
        StudentEntity student = new StudentEntity(
            input.getName(),
            input.getEmail()
        );

        return studentRepository.save(student);
    }

    // READ ALL
    public List<StudentEntity> getAllStudents() {
        return studentRepository.findAll();
    }

    // READ ONE
    public StudentEntity getStudentById(Long id) {
        return studentRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Student not found"
            ));
    }

    // UPDATE
    public StudentEntity putStudent(Long id, StudentEntity input) {
        StudentEntity student = getStudentById(id);

        student.setName(input.getName());
        student.setEmail(input.getEmail());

        return studentRepository.save(student);
    }

    // DELETE
    public void deleteStudent(Long id) {
        StudentEntity student = getStudentById(id);
        studentRepository.delete(student);
    }
}
