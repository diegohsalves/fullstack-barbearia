package com.barbershop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TokenDTO {
	
	private String token;
	private String username;
	private String tipo;

}
