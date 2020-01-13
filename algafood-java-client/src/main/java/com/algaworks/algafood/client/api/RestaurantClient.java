package com.algaworks.algafood.client.api;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import com.algaworks.algafood.client.api.exception.ClientApiException;
import com.algaworks.algafood.client.model.RestaurantDTO;
import com.algaworks.algafood.client.model.RestaurantSummaryDTO;
import com.algaworks.algafood.client.model.input.RestaurantInput;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public class RestaurantClient {
	
	private static final String RESOURCE_PATH = "/restaurants";
	
	private RestTemplate restTemplate;
	private String url;
	
	public List<RestaurantSummaryDTO> list() {
		try {
			URI resourceUri = URI.create(url + RESOURCE_PATH);
			
			RestaurantSummaryDTO[] restaurants = restTemplate.getForObject(resourceUri, RestaurantSummaryDTO[].class);
			
			return Arrays.asList(restaurants);
		} catch(RestClientResponseException ex) {
			throw new ClientApiException(ex.getMessage(), ex);
		}
	}
	
	public RestaurantDTO adicionar(RestaurantInput restaurant) {
		var resourceUri = URI.create(url + RESOURCE_PATH);
		
		try {
			return restTemplate.postForObject(resourceUri, restaurant, RestaurantDTO.class);
		} catch (HttpClientErrorException ex) {
			throw new ClientApiException(ex.getMessage(), ex);
		}
	}

}
