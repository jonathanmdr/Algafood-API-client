package com.algaworks.algafood.client.model.input;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RestaurantInput {
	
	private String name;
	private BigDecimal freightRate;
	private KitchenIdInput kitchen;
	private AddressInput address;

}
