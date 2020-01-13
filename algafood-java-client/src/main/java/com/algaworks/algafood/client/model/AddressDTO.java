package com.algaworks.algafood.client.model;

import lombok.Data;

@Data
public class AddressDTO {
	
	private String zipCode;
	private String publicPlace;
	private String number;	
	private String complement;
	private String neighborhood;
	private KitchenDTO city;

}
