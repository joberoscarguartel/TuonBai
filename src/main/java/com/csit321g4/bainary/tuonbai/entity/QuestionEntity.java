package com.csit321g4.bainary.tuonbai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "questions")
public class QuestionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @NotBlank
    @Size(max = 2000)
    @Column(nullable = false, length = 2000)
    private String questionText;

    @NotNull
    @Positive
    @Column(name = "question_set_id", nullable = false)
    private Long questionSetId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "question_set_id", nullable = false, insertable = false, updatable = false)
    private QuestionSetEntity questionSet;

    public QuestionEntity() {}

    public QuestionEntity(String questionText, Long questionSetId) {
        this.questionText = questionText;
        this.questionSetId = questionSetId;
    }

    public Long getQuestionId() { return questionId; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public Long getQuestionSetId() { return questionSetId; }
    public void setQuestionSetId(Long questionSetId) { this.questionSetId = questionSetId; }
}
