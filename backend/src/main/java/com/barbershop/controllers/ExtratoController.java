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

import com.barbershop.entities.Extrato;
import com.barbershop.services.ExtratoService;

@RestController
@RequestMapping(value = "/extratos")
public class ExtratoController implements Serializable {

	private static final long serialVersionUID = 1L;

	@Autowired
	ExtratoService service;
	
	@GetMapping
	public ResponseEntity<List<Extrato>> listarExtratos(){
		List<Extrato> lista = service.listarExtratos();
		return ResponseEntity.ok().body(lista);
	}
	
	@GetMapping(value = "/{id}")
	public ResponseEntity<Extrato> encontrarPorId(@PathVariable Long id){
		Extrato extrato = service.encontrarPorId(id);
		return ResponseEntity.ok().body(extrato);
	}
	
	@PostMapping
	public ResponseEntity<Extrato> cadastrar(@RequestBody Extrato extrato){
		extrato = service.cadastrarExtrato(extrato);
		URI uri = ServletUriComponentsBuilder.fromPath("/{id}").buildAndExpand(extrato.getId()).toUri();
		return ResponseEntity.created(uri).body(extrato);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		service.deletarExtrato(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Extrato> atualizar(@PathVariable Long id, @RequestBody Extrato extrato){
		extrato = service.atualizarExtrato(id, extrato);
		return ResponseEntity.ok().body(extrato);
	}
}
