package com.algaworks.algafood.client.model;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RestaurantDTO {
	
	private Long id;
	private String name;
	private BigDecimal freightRate;
	private Boolean active;
	private Boolean opened;
	private KitchenDTO kitchen;

}
