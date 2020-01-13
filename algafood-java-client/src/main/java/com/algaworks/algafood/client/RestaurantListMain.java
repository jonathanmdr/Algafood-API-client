package com.algaworks.algafood.client;

import org.springframework.web.client.RestTemplate;

import com.algaworks.algafood.client.api.RestaurantClient;
import com.algaworks.algafood.client.api.exception.ClientApiException;

public class RestaurantListMain {
	
	public static void main(String ... args) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			
			RestaurantClient restaurantClient = new RestaurantClient(restTemplate, "http://localhost:8080");
			
			restaurantClient.list().stream()
				.forEach(System.out::println);		
		} catch(ClientApiException ex) {			
			System.out.println(ex.getApiError() != null ? ex.getApiError() : "Erro desconhecido!");
		}
	}

}
