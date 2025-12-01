package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public List<Teacher> findAll() {
        return this.teacherRepository.findAll();
    }

    public Teacher findById(Long id) {
        Teacher teacher = this.teacherRepository.findById(id).orElse(null);
        if (teacher == null) {
            throw new NotFoundException();
        }
        return teacher;
    }
}
