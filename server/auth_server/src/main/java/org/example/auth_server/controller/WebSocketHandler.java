package org.example.auth_server.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.auth_server.service.RegAdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Tag(name = "WebSocket контроллер", description = "WebSocket контроллер, связанный с обменом сообщений между пользователями")
public class WebSocketHandler {
    private final RegAdminService regAdminService;

    private final SimpMessagingTemplate messagingTemplate;
    @Autowired
    public WebSocketHandler(RegAdminService regAdminService, SimpMessagingTemplate messagingTemplate) {
        this.regAdminService = regAdminService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat")
    public void processMessage(String token, String uuid)  {
        try {
            regAdminService.validateEmail(token);
            messagingTemplate.convertAndSend("/topic/validation/" + uuid, "success");
        } catch (Exception e) {
            messagingTemplate.convertAndSend("/topic/validation/" + uuid, "error " + e.getMessage());
        }

    }
}
