package com.barbershop.services;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.barbershop.entities.Usuario;
import com.barbershop.repositories.UsuarioRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class DetalheUsuarioServiceImpl implements UserDetailsService {

	private final UsuarioRepository usuarioRepository;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
			Usuario usuario = usuarioRepository.findByUsername(username)
					.orElseThrow(() -> new UsernameNotFoundException("Usuário [" + username + "] não encontrado!"));
			
			return new User(usuario.getUsername(), usuario.getPassword(), true, true, true, true, usuario.getAuthorities());
	}

}
