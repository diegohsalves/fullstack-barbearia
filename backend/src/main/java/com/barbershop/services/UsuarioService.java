package com.barbershop.services;

import java.util.List;

import com.barbershop.entities.Usuario;

public interface UsuarioService {
	
	List<Usuario> listarUsuarios();
	Usuario encontrarPorId(Long id);
	Boolean usernameDisponivel(String username);
	Usuario cadastrarUsuario(Usuario usuario);
	void deletarUsuario(Long id);
	Usuario atualizarUsuario(Long id, Usuario usuario);
	void atualizarDados(Usuario novoUsuario, Usuario usuario);
	
}
