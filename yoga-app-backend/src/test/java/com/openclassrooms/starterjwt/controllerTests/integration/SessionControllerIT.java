package com.openclassrooms.starterjwt.controllerTests.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Date;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@WithMockUser
class SessionControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private SessionService sessionService;

    @MockitoBean
    private SessionMapper sessionMapper;

    @Test
    void getById_shouldReturn200() throws Exception {
        Session session = new Session();
        SessionDto dto = new SessionDto();

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(get("/api/session/1"))
                .andExpect(status().isOk());

        verify(sessionService).getById(1L);
    }

    @Test
    void getAll_shouldReturn200() throws Exception {
        when(sessionService.findAll()).thenReturn(List.of());
        when(sessionMapper.toDto(anyList())).thenReturn(List.of());

        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk());

        verify(sessionService).findAll();
    }

    @Test
    void create_shouldReturn200() throws Exception {
        SessionDto dto = validSessionDto();
        Session session = new Session();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(sessionService).create(session);
    }

    @Test
    void update_shouldReturn200() throws Exception {
        SessionDto dto = validSessionDto();
        Session session = new Session();

        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(session);
        when(sessionService.update(eq(1L), any(Session.class))).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(dto);

        mockMvc.perform(put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk());

        verify(sessionService).update(eq(1L), any(Session.class));
    }

    @Test
    void participate_shouldReturn200() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).participate(1L, 2L);
    }

    @Test
    void noLongerParticipate_shouldReturn200() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/2"))
                .andExpect(status().isOk());

        verify(sessionService).noLongerParticipate(1L, 2L);
    }

    @Test
    void delete_shouldReturn200() throws Exception {
        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());

        verify(sessionService).delete(1L);
    }

    private SessionDto validSessionDto() {
        SessionDto dto = new SessionDto();
        dto.setName("Yoga session");
        dto.setDescription("Relaxing yoga");
        dto.setTeacher_id(1L);
        dto.setDate(new Date());
        return dto;
    }
}
