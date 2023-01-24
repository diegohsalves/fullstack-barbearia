package com.barbershop.services;

import java.util.List;

import com.barbershop.entities.Barbeiro;

public interface BarbeiroService {

	List<Barbeiro> listarBarbeiros();
	Barbeiro encontrarPorId(Long id);
	Barbeiro cadastrarBarbeiro(Barbeiro barbeiro);
	void deletarBarbeiro(Long id);
	Barbeiro atualizarBarbeiro(Long id, Barbeiro barbeiro);
	void atualizarDados(Barbeiro novoBarbeiro, Barbeiro barbeiro);
	
}
