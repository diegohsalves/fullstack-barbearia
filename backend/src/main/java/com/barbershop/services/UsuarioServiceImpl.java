package com.barbershop.services;

import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Usuario;
import com.barbershop.repositories.UsuarioRepository;
import com.barbershop.services.exceptions.ResourceNotFoundException;

@Service
public class UsuarioServiceImpl implements UsuarioService {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<Usuario> listarUsuarios() {
		return usuarioRepository.findAll();
	}
	
	@Override
	public Boolean usernameDisponivel(String username) {
		List<Usuario> listaUsuarios = listarUsuarios();
		Boolean disponivel = true;
		
		for(Usuario usuario : listaUsuarios) {
			if(usuario.getUsername().equals(username)) {
				disponivel = false;
			}
		}
		
		return disponivel;
	}

	public Usuario encontrarPorId(Long id) {
		Optional<Usuario> usuario = usuarioRepository.findById(id);
		return usuario
				.orElseThrow(() -> new ResourceNotFoundException("Nenhum usuario foi encontrado com a Id informada!"));
	}

	public Usuario cadastrarUsuario(Usuario usuario) {
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
		return usuarioRepository.save(usuario);
	}

	public void deletarUsuario(Long id) {

		try {
			usuarioRepository.deleteById(id);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Usuario não encontrado!");
		}
	}

	public Usuario atualizarUsuario(Long id, Usuario novoUsuario) {

		try {
			Usuario usuario = usuarioRepository.getReferenceById(id);
			atualizarDados(novoUsuario, usuario);
			return usuarioRepository.save(usuario);

		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException("Usuario não encontrado!");
		}
	}

	public void atualizarDados(Usuario novoUsuario, Usuario usuario) {
		usuario.setUsername(novoUsuario.getUsername());
		usuario.setPassword(novoUsuario.getPassword());
	}

}