package com.csit321g4.bainary.tuonbai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "question_sets")
public class QuestionSetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionSetId;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @Size(max = 2000)
    @Column(length = 2000)
    private String description;

    @NotNull
    @Positive
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false, insertable = false, updatable = false)
    private StudentEntity student;

    public QuestionSetEntity() {}

    public QuestionSetEntity(String title, String description, Long studentId) {
        this.title = title;
        this.description = description;
        this.studentId = studentId;
    }

    public Long getQuestionSetId() { return questionSetId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
}
