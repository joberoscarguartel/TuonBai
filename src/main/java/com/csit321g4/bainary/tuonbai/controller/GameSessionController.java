package com.csit321g4.bainary.tuonbai.controller;

import com.csit321g4.bainary.tuonbai.entity.GameSessionEntity;
import com.csit321g4.bainary.tuonbai.service.GameSessionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game-sessions")
public class GameSessionController {

    @Autowired
    private GameSessionService gameSessionService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GameSessionEntity postGameSession(@Valid @RequestBody GameSessionEntity input) {
        return gameSessionService.postGameSession(input);
    }

    // READ ALL
    @GetMapping
    public List<GameSessionEntity> getAllGameSessions() {
        return gameSessionService.getAllGameSessions();
    }

    // READ ONE
    @GetMapping("/{id}")
    public GameSessionEntity getGameSessionById(@PathVariable("id") Long id) {
        return gameSessionService.getGameSessionById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public GameSessionEntity putGameSession(
        @PathVariable("id") Long id, @Valid @RequestBody GameSessionEntity input
    ) {
        return gameSessionService.putGameSession(id, input);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGameSession(@PathVariable("id") Long id) {
        gameSessionService.deleteGameSession(id);
    }
}
