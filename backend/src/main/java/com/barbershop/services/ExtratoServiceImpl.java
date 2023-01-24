package com.barbershop.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Extrato;
import com.barbershop.repositories.ExtratoRepository;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class ExtratoServiceImpl implements ExtratoService{

	@Autowired
	private ExtratoRepository extratoRepository;
	
	public List<Extrato> listarExtratos(){
		return extratoRepository.findAll();
	}
	
	public Extrato encontrarPorId(Long id) {
		Optional<Extrato> extrato = extratoRepository.findById(id);
		return extrato.orElseThrow(() -> new ResourceNotFoundException("Nenhum extrato foi encontrado com a Id informada!"));
	}
	
	public Extrato cadastrarExtrato(Extrato extrato) {
		return extratoRepository.save(extrato);
	}
	
	public void deletarExtrato(Long id) {
		
		try {
			extratoRepository.deleteById(id);
			
			}catch(EntityNotFoundException e) {
				throw new ResourceNotFoundException("Extrato não encontrado!");			
			}	
		}
	
	public Extrato atualizarExtrato(Long id, Extrato novoExtrato) {
		
		try {
			Extrato extrato = extratoRepository.getReferenceById(id);
			atualizarDados(novoExtrato, extrato);
			return extratoRepository.save(extrato);
			
		}catch(EntityNotFoundException e) {
			throw new ResourceNotFoundException("Extrato não encontrado!");			
		}
	}
	
	public void atualizarDados(Extrato novoExtrato, Extrato extrato) {
		extrato.setAgendamentos(novoExtrato.getAgendamentos());
		extrato.setDataCriacao(novoExtrato.getDataCriacao());
		extrato.setObservacao(novoExtrato.getObservacao());

	}

}
