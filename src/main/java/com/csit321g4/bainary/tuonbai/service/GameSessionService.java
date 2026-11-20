package com.csit321g4.bainary.tuonbai.service;

import com.csit321g4.bainary.tuonbai.entity.GameSessionEntity;
import com.csit321g4.bainary.tuonbai.repository.GameSessionRepository;
import com.csit321g4.bainary.tuonbai.repository.StudentRepository;
import com.csit321g4.bainary.tuonbai.repository.QuestionSetRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class GameSessionService {

    @Autowired
    private GameSessionRepository gameSessionRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private QuestionSetRepository questionSetRepository;

    // CREATE
    public GameSessionEntity postGameSession(GameSessionEntity input) {
        validateParents(input);
        GameSessionEntity gameSession = new GameSessionEntity(
            input.getStudentId(), input.getQuestionSetId(), input.getScore(), input.getStatus()
        );
        return gameSessionRepository.save(gameSession);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<GameSessionEntity> getAllGameSessions() {
        return gameSessionRepository.findAll();
    }

    // READ ONE
    @Transactional(readOnly = true)
    public GameSessionEntity getGameSessionById(Long id) {
        return gameSessionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Game session not found"
            ));
    }

    // UPDATE
    public GameSessionEntity putGameSession(Long id, GameSessionEntity input) {
        GameSessionEntity gameSession = getGameSessionById(id);
        validateParents(input);
        gameSession.setStudentId(input.getStudentId());
        gameSession.setQuestionSetId(input.getQuestionSetId());
        gameSession.setScore(input.getScore());
        gameSession.setStatus(input.getStatus());
        return gameSessionRepository.save(gameSession);
    }

    // DELETE
    public void deleteGameSession(Long id) {
        GameSessionEntity gameSession = getGameSessionById(id);
        gameSessionRepository.delete(gameSession);
    }

    private void validateParents(GameSessionEntity input) {
        if (!studentRepository.existsById(input.getStudentId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
        if (!questionSetRepository.existsById(input.getQuestionSetId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question set not found");
        }
    }
}
