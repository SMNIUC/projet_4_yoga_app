package com.openclassrooms.starterjwt.serviceTests;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("John");
        user.setLastName("Doe");
    }

    @Test
    void findById_ShouldReturnUser_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User found = userService.findById(1L);

        assertThat(found).isNotNull();
        assertThat(found.getId()).isEqualTo(1L);
        verify(userRepository).findById(1L);
    }

    @Test
    void findById_ShouldThrowNotFoundException_WhenNotExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.findById(1L))
                .isInstanceOf(NotFoundException.class);

        verify(userRepository).findById(1L);
    }

    @Test
    void findUserByEmail_ShouldReturnUser_WhenExists() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        User found = userService.findUserByEmail("test@example.com");

        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("test@example.com");
        verify(userRepository).findByEmail("test@example.com");
    }

    @Test
    void findUserByEmail_ShouldReturnNull_WhenNotExists() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        User found = userService.findUserByEmail("missing@example.com");

        assertThat(found).isNull();
        verify(userRepository).findByEmail("missing@example.com");
    }

    @Test
    void existsByEmail_ShouldReturnTrue_WhenEmailExists() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        boolean exists = userService.existsByEmail("test@example.com");

        assertThat(exists).isTrue();
        verify(userRepository).existsByEmail("test@example.com");
    }

    @Test
    void existsByEmail_ShouldReturnFalse_WhenEmailDoesNotExist() {
        when(userRepository.existsByEmail("missing@example.com")).thenReturn(false);

        boolean exists = userService.existsByEmail("missing@example.com");

        assertThat(exists).isFalse();
        verify(userRepository).existsByEmail("missing@example.com");
    }

    @Test
    void createNewUser_ShouldSaveUserWithEncodedPassword() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("new@example.com");
        signupRequest.setFirstName("Alice");
        signupRequest.setLastName("Smith");
        signupRequest.setPassword("password123");

        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        userService.createNewUser(signupRequest);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertThat(savedUser.getEmail()).isEqualTo("new@example.com");
        assertThat(savedUser.getFirstName()).isEqualTo("Alice");
        assertThat(savedUser.getLastName()).isEqualTo("Smith");
        assertThat(savedUser.getPassword()).isEqualTo("encodedPassword");
    }

    @Test
    void delete_ShouldCallRepositoryDeleteById() {
        userService.delete(1L);

        verify(userRepository).deleteById(1L);
    }
}
