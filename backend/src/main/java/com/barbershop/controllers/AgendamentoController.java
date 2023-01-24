package com.barbershop.controllers;

import java.io.Serializable;
import java.net.URI;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbershop.entities.Agendamento;
import com.barbershop.services.AgendamentoService;
import com.barbershop.services.BarbeiroService;
import com.barbershop.services.ServicoService;

@RestController
@RequestMapping(value = "/agendamentos")
public class AgendamentoController implements Serializable{

	private static final long serialVersionUID = 1L;

	@Autowired
	AgendamentoService agendamentoService;
	
	@Autowired
	BarbeiroService barbeiroService;
	
	@Autowired
	ServicoService servicoService;
	
	@GetMapping
	public ResponseEntity<List<Agendamento>> listarTodos(){
		List<Agendamento> lista = agendamentoService.listarAgendamentos();
		return ResponseEntity.ok().body(lista);
	} 
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Agendamento> encontrarPorId(@PathVariable Long id){
		Agendamento agendamento = agendamentoService.encontrarPorId(id);
		return ResponseEntity.ok().body(agendamento);
	}
	
	@PostMapping
	public ResponseEntity<Agendamento> cadastrar(@RequestBody Agendamento agendamento){
		agendamento = agendamentoService.cadastrarAgendamento(agendamento);
		URI uri = ServletUriComponentsBuilder.fromPath("/{id}").buildAndExpand(agendamento.getId()).toUri();
		return ResponseEntity.created(uri).body(agendamento);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		agendamentoService.deletarAgendamento(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Agendamento> atualizar(@PathVariable Long id, @RequestBody Agendamento agendamento){
		agendamento = agendamentoService.atualizarAgendamento(id, agendamento);
		return ResponseEntity.ok().body(agendamento);
	}
	
	@PostMapping(value = "/horarios")
	public ResponseEntity<List<LocalTime>> horariosDisponiveis(@RequestParam(value = "id") Long id, @RequestParam(value = "data") LocalDate data) {
		
		List<LocalTime> lista = agendamentoService.horariosDisponiveis(id, data);
		return ResponseEntity.ok().body(lista);
	}
	
	@PostMapping(value = "/encaixe")
	public ResponseEntity<Boolean> encaixeHorario(@RequestParam(value = "horarioEscolhidoInicio") String horarioEscolhidoInicio, @RequestParam(value = "horariosDisponiveis") List<String> horariosDisponiveis, @RequestParam(value = "ids") List<Long> listaServicos) {
		
		Boolean encaixou = agendamentoService.encaixeHorario(horarioEscolhidoInicio, horariosDisponiveis, listaServicos);
		return ResponseEntity.ok().body(encaixou);
	}

}
