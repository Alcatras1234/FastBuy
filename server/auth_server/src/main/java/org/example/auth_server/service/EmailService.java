package org.example.auth_server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class EmailService {
    private static Properties properties;

    @Autowired
    public EmailService() {
        properties = properties();
    }


}
