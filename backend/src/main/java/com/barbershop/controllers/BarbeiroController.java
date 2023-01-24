package com.barbershop.controllers;

import java.io.Serializable;
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

import com.barbershop.entities.Barbeiro;
import com.barbershop.services.BarbeiroService;

@RestController
@RequestMapping(value = "/barbeiros")
public class BarbeiroController implements Serializable {

	private static final long serialVersionUID = 1L;

	@Autowired
	BarbeiroService service;
	
	@GetMapping
	public ResponseEntity<List<Barbeiro>> listarBarbeiros(){
		List<Barbeiro> lista = service.listarBarbeiros();
		return ResponseEntity.ok().body(lista);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Barbeiro> encontrarPorId(@PathVariable Long id){
		Barbeiro barbeiro = service.encontrarPorId(id);
		return ResponseEntity.ok().body(barbeiro);
	}
	
	@PostMapping
	public ResponseEntity<Barbeiro> cadastrar(@RequestBody Barbeiro barbeiro){
		barbeiro = service.cadastrarBarbeiro(barbeiro);
		URI uri = ServletUriComponentsBuilder.fromPath("/{id}").buildAndExpand(barbeiro.getId()).toUri();
		return ResponseEntity.created(uri).body(barbeiro);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		service.deletarBarbeiro(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Barbeiro> atualizar(@PathVariable Long id, @RequestBody Barbeiro barbeiro){
		barbeiro = service.atualizarBarbeiro(id, barbeiro);
		return ResponseEntity.ok().body(barbeiro);
	}
}
