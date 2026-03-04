package com.openclassrooms.starterjwt.serviceTests;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private Teacher teacher;

    @BeforeEach
    void setUp() {
        teacher = new Teacher();
        teacher.setId(1L);
    }

    @Test
    void findAll_ShouldReturnAllTeachers() {
        List<Teacher> teachers = List.of(teacher);
        when(teacherRepository.findAll()).thenReturn(teachers);

        List<Teacher> result = teacherService.findAll();

        assertThat(result).hasSize(1).contains(teacher);
        verify(teacherRepository).findAll();
    }

    @Test
    void findById_ShouldReturnTeacher_WhenExists() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        Teacher found = teacherService.findById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
        verify(teacherRepository).findById(1L);
    }

    @Test
    void findById_ShouldThrowNotFoundException_WhenNotExists() {
        when(teacherRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> teacherService.findById(1L))
                .isInstanceOf(NotFoundException.class);

        verify(teacherRepository).findById(1L);
    }
}
