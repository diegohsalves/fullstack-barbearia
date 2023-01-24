package com.barbershop.services;

import java.util.List;

import com.barbershop.entities.Servico;

public interface ServicoService {
	
	List<Servico> listarServicos();
	Servico encontrarPorId(Long id);
	Servico cadastrarServico(Servico servico);
	void deletarServico(Long id);
	Servico atualizarServico(Long id, Servico servico);
	void atualizarDados(Servico novoServico, Servico servico);

}
