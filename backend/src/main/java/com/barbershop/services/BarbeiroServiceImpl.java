package com.barbershop.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Barbeiro;
import com.barbershop.repositories.BarbeiroRepository;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class BarbeiroServiceImpl implements BarbeiroService{

	@Autowired
	private BarbeiroRepository barbeiroRepository;

	public List<Barbeiro> listarBarbeiros() {
		return barbeiroRepository.findAll((Sort.by(Sort.Direction.ASC, "nome")));
	}
	
	public Barbeiro encontrarPorId(Long id) {
		Optional<Barbeiro> barbeiro = barbeiroRepository.findById(id);
		return barbeiro.orElseThrow(() -> new ResourceNotFoundException("Nenhum barbeiro foi encontrado com a Id informada!"));
	}
	
	public Barbeiro cadastrarBarbeiro(Barbeiro barbeiro) {
		
		return barbeiroRepository.save(barbeiro);
	}
	
	public void deletarBarbeiro(Long id) {
		
		try {
			barbeiroRepository.deleteById(id);
			
			}catch(EntityNotFoundException e) {
				throw new ResourceNotFoundException("Barbeiro não encontrado!");			
			}	
		}
	
	public Barbeiro atualizarBarbeiro(Long id, Barbeiro novoBarbeiro) {
		
		try {
			Barbeiro barbeiro = barbeiroRepository.getReferenceById(id);
			atualizarDados(novoBarbeiro, barbeiro);
			return barbeiroRepository.save(barbeiro);
			
		}catch(EntityNotFoundException e) {
			throw new ResourceNotFoundException("Barbeiro não encontrado!");			
		}
	}
	
	public void atualizarDados(Barbeiro novoBarbeiro, Barbeiro barbeiro) {
		barbeiro.setNome(novoBarbeiro.getNome());
		barbeiro.setDomingo(novoBarbeiro.getDomingo());
		barbeiro.setSegunda(novoBarbeiro.getSegunda());
		barbeiro.setTerca(novoBarbeiro.getTerca());
		barbeiro.setQuarta(novoBarbeiro.getQuarta());
		barbeiro.setQuinta(novoBarbeiro.getQuinta());
		barbeiro.setSexta(novoBarbeiro.getSexta());
		barbeiro.setSabado(novoBarbeiro.getSabado());
		barbeiro.setEntrada(novoBarbeiro.getEntrada());
		barbeiro.setSaida(novoBarbeiro.getSaida());
		barbeiro.setAlmoco(novoBarbeiro.getAlmoco());
		barbeiro.setRetorno(novoBarbeiro.getRetorno());

	}


}
