package org.example.auth_server.service;

import org.example.auth_server.dto.ContactOrganizatorInfoRequest;
import org.example.auth_server.dto.OrganizatorBankDetailsRequest;
import org.example.auth_server.enums.ContactTypeEnum;
import org.example.auth_server.model.OrdanizerBankDetails;
import org.example.auth_server.model.Organizator;
import org.example.auth_server.model.User;
import org.example.auth_server.repository.OrganizatorRepository;
import org.example.auth_server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class OrganizatorService {

    private final OrganizatorRepository organizatorRepository;
    private final UserRepository userRepository;

    @Autowired
    public OrganizatorService(OrganizatorRepository organizatorRepository, UserRepository userRepository) {
        this.organizatorRepository = organizatorRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void updateLegalInfo (ContactOrganizatorInfoRequest contactOrganizatorInfoRequest) {
        Organizator organizator = new Organizator();
        User user = userRepository.findUserById(contactOrganizatorInfoRequest.getUserId());
        organizator.setUser(user);
        organizator.setCompanyName(contactOrganizatorInfoRequest.getCompanyName());
        organizator.setLegalAddress(contactOrganizatorInfoRequest.getLegalAdress());
        organizator.setRegistrationNumber(contactOrganizatorInfoRequest.getRegistrationNumber());
        organizator.setTaxId(contactOrganizatorInfoRequest.getTaxId());
        organizator.setPostalCode(contactOrganizatorInfoRequest.getPostalCode());
        organizator.setContactType(contactOrganizatorInfoRequest.getContactType());
        organizator.setContactValue(contactOrganizatorInfoRequest.getContactValue());
        organizator.setIsPrimary(true);
        organizator.setCreatedDttm(LocalDateTime.now());
        organizatorRepository.save(organizator);
    }

    @Transactional
    public void updateBankInfo(OrganizatorBankDetailsRequest oBDR) {
        OrdanizerBankDetails ordanizerBankDetails = new OrdanizerBankDetails();
        Organizator organizator = organizatorRepository.findOrganizatorById(oBDR.getLegalInfoId());
        
    }
}
