package org.example.auth_server;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "from", ignoreUnknownFields = false)
@Getter
@Setter
public class AuthServiceConfig {
    @NotEmpty String gmail;
    @NotEmpty String password;
}
