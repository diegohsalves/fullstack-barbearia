package com.barbershop.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Servico;
import com.barbershop.repositories.ServicoRepository;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class ServicoServiceImpl implements ServicoService {

	@Autowired
	private ServicoRepository servicoRepository;
	
	public List<Servico> listarServicos(){
		return servicoRepository.findAll((Sort.by(Sort.Direction.ASC, "nome")));
	}

	public Servico encontrarPorId(Long id) {
		Optional<Servico> servico = servicoRepository.findById(id);
		return servico.orElseThrow(() -> new ResourceNotFoundException("Nenhum serviço foi encontrado com a Id informada!"));  
	}
	
	public Servico cadastrarServico(Servico servico) {
		return servicoRepository.save(servico);
	}
	
	public void deletarServico(Long id) {
		
		try {
			servicoRepository.deleteById(id);
			
			}catch(EntityNotFoundException e) {
				throw new ResourceNotFoundException("Serviço não encontrado!");			
			}	
		}
	
	public Servico atualizarServico(Long id, Servico novoServico) {
		
		try {
			Servico servico = servicoRepository.getReferenceById(id);
			atualizarDados(novoServico, servico);
			return servicoRepository.save(servico);
			
		}catch(EntityNotFoundException e) {
			throw new ResourceNotFoundException("Serviço não encontrado!");			
		}
	}
	
	public void atualizarDados(Servico novoServico, Servico servico) {
		servico.setNome(novoServico.getNome());
		servico.setPreco(novoServico.getPreco());
		servico.setTempoDuracao(novoServico.getTempoDuracao());

	}

}
