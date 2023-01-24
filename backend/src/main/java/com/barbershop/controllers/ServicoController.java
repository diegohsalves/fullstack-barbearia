package com.barbershop.controllers;

import java.net.URI;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbershop.entities.Servico;
import com.barbershop.services.ServicoService;

@RestController
@RequestMapping(value = "/servicos")
public class ServicoController {
	
	@Autowired
	ServicoService service;
	
	@GetMapping
	public ResponseEntity<List<Servico>> listarTodos(){
		List<Servico> lista = service.listarServicos();
		return ResponseEntity.ok().body(lista);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Servico> encontrarPorId(@PathVariable Long id){
		Servico servico = service.encontrarPorId(id);
		return ResponseEntity.ok().body(servico);
	}
	
	@PostMapping
	public ResponseEntity<Servico> cadastrar(@RequestBody Servico servico){
		servico = service.cadastrarServico(servico);
		URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(servico.getId()).toUri();
		return ResponseEntity.created(uri).body(servico);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		service.deletarServico(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Servico> atualizar(@PathVariable Long id, @RequestBody Servico servico){
		servico = service.atualizarServico(id, servico);
		return ResponseEntity.ok().body(servico);
	}

}
