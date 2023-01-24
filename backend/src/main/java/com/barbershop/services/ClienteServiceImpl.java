package com.barbershop.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Cliente;
import com.barbershop.repositories.ClienteRepository;
import com.barbershop.services.exceptions.NotValidCpfException;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class ClienteServiceImpl implements ClienteService {

	@Autowired
	private ClienteRepository clienteRepository;

	public List<Cliente> listarClientes() {
		return clienteRepository.findAll((Sort.by(Sort.Direction.ASC, "nome")));
	}
	
	public Cliente encontrarPorId(Long id) {

		Optional<Cliente> cliente = clienteRepository.findById(id);
		return cliente.orElseThrow(() -> new ResourceNotFoundException("Nenhum cliente foi encontrado com a Id informada!"));
	}

	public Cliente cadastrarCliente(Cliente cliente) {
			try {
				List<Cliente> listaClientes = listarClientes();
				
				for(Cliente c : listaClientes) {
					if(c.getCpf().equals(cliente.getCpf())) {
						throw new NotValidCpfException("");
					}
				}
				
				return clienteRepository.save(cliente);
				
			}catch(NotValidCpfException e) {
				throw new NotValidCpfException("Cpf já cadastrado!");
			
			}
	}

	public void deletarCliente(Long id) {

		try {
			clienteRepository.deleteById(id);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Cliente não encontrado!");
		}
	}

	public Cliente atualizarCliente(Long id, Cliente novoCliente) {

		try {
			Cliente cliente = clienteRepository.getReferenceById(id);
			atualizarDados(novoCliente, cliente);
			return clienteRepository.save(cliente);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Cliente não encontrado!");
		}
	}

	public void atualizarDados(Cliente novoCliente, Cliente cliente) {
		cliente.setNome(novoCliente.getNome());
		cliente.setCpf(novoCliente.getCpf());
		cliente.setEmail(novoCliente.getEmail());
		cliente.setTelefone(novoCliente.getTelefone());
	}

}
