package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatCode;

@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
public class SpringBootSecurityJwtApplicationTest {

    @Test
    public void contextLoads() {}

    @Test
    void main_ShouldStartApplicationWithoutException() {
        assertThatCode(() -> SpringBootSecurityJwtApplication.main(new String[]{}))
                .doesNotThrowAnyException();
    }
}
