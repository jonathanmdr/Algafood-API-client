package com.algaworks.algafood.client.api.exception;

import org.springframework.web.client.RestClientResponseException;

import com.algaworks.algafood.client.model.ApiError;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class ClientApiException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	@Getter
	private ApiError apiError;

	public ClientApiException(String message, RestClientResponseException ex) {
		super(message, ex);
		
		desserializeApiError(ex);
	}
	
	private void desserializeApiError(RestClientResponseException ex) {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.registerModule(new JavaTimeModule());
		mapper.findAndRegisterModules();
		
		try {
			this.apiError = mapper.readValue(ex.getResponseBodyAsString(), ApiError.class);
		} catch (Exception e) {
			log.warn("Não foi possível desserializar a resposta em um ApiError.", e);
		}
	}
	
}
