package com.openclassrooms.starterjwt.controllerTests.unit;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    @InjectMocks
    private TeacherController teacherController;

    @Mock
    private TeacherMapper teacherMapper;

    @Mock
    private TeacherService teacherService;

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(id);
        TeacherDto teacherDto = new TeacherDto();
        when(teacherService.findById(id)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        // When
        ResponseEntity<?> response = teacherController.findById(String.valueOf(id));

        // Then
        Assertions.assertEquals(ResponseEntity.ok().body(teacherDto), response);
        verify(teacherService, times(1)).findById(id);
        verify(teacherMapper, times(1)).toDto(teacher);
    }

    @Test
    void testFindAll() {
        // Given
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        List<Teacher> teachers = Arrays.asList(teacher1, teacher2);
        List<TeacherDto> TeacherDtoList = Arrays.asList(new TeacherDto(), new TeacherDto());
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(TeacherDtoList);

        // When
        ResponseEntity<?> response = teacherController.findAll();

        // Then
        Assertions.assertEquals(ResponseEntity.ok().body(TeacherDtoList), response);
        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teachers);
    }

    @Test
    void testFindAllReturnsEmptyList() {
        // Given
        List<Teacher> teachers = Collections.emptyList();
        List<TeacherDto> emptyTeacherDtoList = Collections.emptyList();
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(emptyTeacherDtoList);

        // When
        ResponseEntity<?> response = teacherController.findAll();

        // Then
        Assertions.assertEquals(ResponseEntity.ok().body(emptyTeacherDtoList), response);
        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teachers);
    }
}
