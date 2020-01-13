package com.algaworks.algafood.client.model;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class RestaurantSummaryDTO {
	
	private Long id;
	private String name;
	private BigDecimal freightRate;
	private KitchenDTO kitchen;

}
