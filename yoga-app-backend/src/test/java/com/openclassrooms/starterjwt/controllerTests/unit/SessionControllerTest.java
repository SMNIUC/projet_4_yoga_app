package com.openclassrooms.starterjwt.controllerTests.unit;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionControllerTest {

    @Mock
    private SessionMapper sessionMapper;

    @Mock
    private SessionService sessionService;

    @InjectMocks
    private SessionController sessionController;

    private Session session;
    private SessionDto sessionDto;

    @BeforeEach
    void setUp() {
        session = new Session();
        sessionDto = new SessionDto();
    }

    @Test
    void findById_shouldReturnSessionDto() {
        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEqualTo(sessionDto);

        verify(sessionService).getById(1L);
        verify(sessionMapper).toDto(session);
    }

    @Test
    void findAll_shouldReturnListOfSessionDto() {
        List<Session> sessions = List.of(session);
        List<SessionDto> sessionDtos = List.of(sessionDto);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEqualTo(sessionDtos);

        verify(sessionService).findAll();
        verify(sessionMapper).toDto(sessions);
    }

    @Test
    void create_shouldCreateSession() {
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.create(sessionDto);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEqualTo(sessionDto);

        verify(sessionService).create(session);
    }

    @Test
    void update_shouldUpdateSession() {
        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.update("1", sessionDto);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        assertThat(response.getBody()).isEqualTo(sessionDto);

        verify(sessionService).update(1L, session);
    }

    @Test
    void participate_shouldReturnOk() {
        ResponseEntity<?> response = sessionController.participate("1", "2");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();

        verify(sessionService).participate(1L, 2L);
    }

    @Test
    void noLongerParticipate_shouldReturnOk() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "2");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();

        verify(sessionService).noLongerParticipate(1L, 2L);
    }

    @Test
    void delete_shouldReturnOk() {
        ResponseEntity<?> response = sessionController.save("1");

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();

        verify(sessionService).delete(1L);
    }
}
