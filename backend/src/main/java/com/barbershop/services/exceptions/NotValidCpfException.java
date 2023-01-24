package com.barbershop.services.exceptions;

public class NotValidCpfException extends RuntimeException{

	private static final long serialVersionUID = 1L;
	
	public NotValidCpfException(String msg) {
		super(msg);
	}
}
