package com.barbershop.services;

import java.util.List;

import com.barbershop.entities.Extrato;

public interface ExtratoService {
	
	List<Extrato> listarExtratos();
	Extrato encontrarPorId(Long id);
	Extrato cadastrarExtrato(Extrato extrato);
	void deletarExtrato(Long id);
	Extrato atualizarExtrato(Long id, Extrato extrato);
	void atualizarDados(Extrato novoExtrato, Extrato extrato);

}
