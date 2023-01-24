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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.barbershop.entities.Usuario;
import com.barbershop.services.UsuarioService;

@RestController
@RequestMapping(value = "/usuarios")
public class UsuarioController implements Serializable {

	private static final long serialVersionUID = 1L;

	@Autowired
	UsuarioService service;

	@GetMapping
	public ResponseEntity<List<Usuario>> listarUsuarios() {
		List<Usuario> lista = service.listarUsuarios();
		return ResponseEntity.ok().body(lista);
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<Usuario> encontrarPorId(@PathVariable Long id) {
		Usuario usuario = service.encontrarPorId(id);
		return ResponseEntity.ok().body(usuario);
	}
	
	@PostMapping(value = "/usernameDisponivel")
	public ResponseEntity<Boolean> usernameDisponivel(@RequestParam(value = "username") String username) {
		Boolean disponibilidade = service.usernameDisponivel(username);
		return ResponseEntity.ok().body(disponibilidade);
	}
	
	@PostMapping
	public ResponseEntity<Usuario> cadastrar(@RequestBody Usuario usuario){
		usuario = service.cadastrarUsuario(usuario);
		URI uri = ServletUriComponentsBuilder.fromPath("/{id}").buildAndExpand(usuario.getId()).toUri();
		return ResponseEntity.created(uri).body(usuario);
	}
	
	@DeleteMapping(value = "/{id}")
	public ResponseEntity<Void> deletar(@PathVariable Long id){
		service.deletarUsuario(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping(value = "/{id}")
	public ResponseEntity<Usuario> atualizar(@PathVariable Long id, @RequestBody Usuario usuario){
		usuario = service.atualizarUsuario(id, usuario);
		return ResponseEntity.ok().body(usuario);
	}
}
