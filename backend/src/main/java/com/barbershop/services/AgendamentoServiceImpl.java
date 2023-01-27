package com.barbershop.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Agendamento;
import com.barbershop.entities.Barbeiro;
import com.barbershop.entities.Servico;
import com.barbershop.entities.util.Util;
import com.barbershop.repositories.AgendamentoRepository;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class AgendamentoServiceImpl implements AgendamentoService {
	
	DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");
	
	@Autowired
	private AgendamentoRepository agendamentoRepository;
	
	@Autowired
	private ServicoServiceImpl servicoService;
	
	@Autowired
	private BarbeiroServiceImpl barbeiroService;
	
	public List<Agendamento> listarAgendamentos(){
		
		List<Agendamento> listaAgendamentos = agendamentoRepository.findAll((Sort.by(Sort.Direction.ASC, "data").and((Sort.by(Sort.Direction.ASC, "horario")))));

		return listaAgendamentos;
	}
	
	public Agendamento encontrarPorId(Long id) {
		Optional<Agendamento> agendamento = agendamentoRepository.findById(id);
		return agendamento.orElseThrow(() -> new ResourceNotFoundException("Nenhum agendamento foi encontrado com a Id informada!"));
	}
	
	public Agendamento cadastrarAgendamento(Agendamento agendamento) {
		return agendamentoRepository.save(agendamento);
	}
	
	public void deletarAgendamento(Long id) {
		
		try {
			agendamentoRepository.deleteById(id);
			
			}catch(EntityNotFoundException e) {
				throw new ResourceNotFoundException("Agendamento não encontrado!");			
			}	
		}
	
	public Agendamento atualizarAgendamento(Long id, Agendamento novoAgendamento) {
		
		try {
			Agendamento agendamento = agendamentoRepository.getReferenceById(id);
			atualizarDados(novoAgendamento, agendamento);
			return agendamentoRepository.save(agendamento);
			
		}catch(EntityNotFoundException e) {
			throw new ResourceNotFoundException("Agendamento não encontrado!");			
		}
	}
	
	public void atualizarDados(Agendamento novoAgendamento, Agendamento agendamento) {
		agendamento.setCliente(novoAgendamento.getCliente());
		agendamento.setBarbeiro(novoAgendamento.getBarbeiro());
		agendamento.setServicos(novoAgendamento.getServicos());
		agendamento.setData(novoAgendamento.getData());
		agendamento.setHorario(novoAgendamento.getHorario());
		agendamento.setTotal(novoAgendamento.getTotal());
		agendamento.setObservacao(novoAgendamento.getObservacao());
		agendamento.setStatus(novoAgendamento.getStatus());
	}
	
	@Override
	public List<LocalTime> horariosDisponiveis(Long id, LocalDate data) {
		
		Barbeiro barbeiro = barbeiroService.encontrarPorId(id);
		List<LocalTime> lista = Util.horariosDisponiveis(barbeiro, data);
		
		return lista;
	}

	@Override
	public Boolean encaixeHorario(String horarioEscolhidoInicio, List<String> horariosDisponiveis, List<Long> listaServicos) {
		
		List<Servico> servicos = new ArrayList<>();
		
		for(Long id : listaServicos) {
			Servico s = servicoService.encontrarPorId(id);
			servicos.add(s);
		}
		
		Boolean encaixou = Util.encaixeHorario(horariosDisponiveis, horarioEscolhidoInicio, servicos);
		
		return encaixou;
	}

}
