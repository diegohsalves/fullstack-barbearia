package com.barbershop.entities.exceptions;

public class HorarioIncompativelException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public HorarioIncompativelException(String msg) {
		super(msg);
	}

}
