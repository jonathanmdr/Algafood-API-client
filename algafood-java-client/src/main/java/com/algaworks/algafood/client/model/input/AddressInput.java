package com.algaworks.algafood.client.model.input;

import lombok.Data;

@Data
public class AddressInput {
	
	private String zipCode;
	private String publicPlace;
	private String number;	
	private String complement;
	private String neighborhood;
	private CityIdInput city;

}
