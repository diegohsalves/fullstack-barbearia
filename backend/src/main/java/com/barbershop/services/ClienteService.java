package com.barbershop.services;

import java.util.List;

import com.barbershop.entities.Cliente;

public interface ClienteService {
	
	List<Cliente> listarClientes();
	Cliente encontrarPorId(Long id);
	Cliente cadastrarCliente(Cliente cliente);
	void deletarCliente(Long id);
	Cliente atualizarCliente(Long id, Cliente cliente);
	void atualizarDados(Cliente novoCliente, Cliente cliente);
	
}
