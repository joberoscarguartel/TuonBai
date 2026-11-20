package com.csit321g4.bainary.tuonbai.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Entity
@Table(name = "game_sessions")
public class GameSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long gameSessionId;

    @NotNull
    @Positive
    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id", nullable = false, insertable = false, updatable = false)
    private StudentEntity student;

    @NotNull
    @Positive
    @Column(name = "question_set_id", nullable = false)
    private Long questionSetId;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "question_set_id", nullable = false, insertable = false, updatable = false)
    private QuestionSetEntity questionSet;

    @NotNull
    @PositiveOrZero
    @Column(nullable = false)
    private Integer score = 0;

    @NotBlank
    @Pattern(regexp = "IN_PROGRESS|COMPLETED|ABANDONED",
        message = "must be IN_PROGRESS, COMPLETED, or ABANDONED")
    @Column(nullable = false, length = 20)
    private String status = "IN_PROGRESS";

    public GameSessionEntity() {}

    @JsonCreator(mode = JsonCreator.Mode.DISABLED)
    public GameSessionEntity(Long studentId, Long questionSetId, Integer score, String status) {
        this.studentId = studentId;
        this.questionSetId = questionSetId;
        this.score = score;
        this.status = status;
    }

    public Long getGameSessionId() { return gameSessionId; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getQuestionSetId() { return questionSetId; }
    public void setQuestionSetId(Long questionSetId) { this.questionSetId = questionSetId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
