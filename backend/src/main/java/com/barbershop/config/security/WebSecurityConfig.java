package com.barbershop.config.security;

import java.util.Arrays;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import com.barbershop.repositories.UsuarioRepository;

import lombok.AllArgsConstructor;

@Configuration
@EnableGlobalMethodSecurity(prePostEnabled = true)
@AllArgsConstructor
public class WebSecurityConfig {
	
	private final JWTTokenService tokenService;
	private final UsuarioRepository usuarioRepository;

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

		http.httpBasic().and().authorizeHttpRequests()
		.antMatchers(HttpMethod.POST, "/login").permitAll()
		.antMatchers(HttpMethod.POST, "/usuarios").permitAll()
		.antMatchers(HttpMethod.POST, "/usuarios/usernameDisponivel").permitAll()
		.anyRequest().authenticated()
		.and().headers().frameOptions().disable().and().csrf().disable().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
		.addFilterBefore(new JWTFiltroAutenticacao(tokenService, usuarioRepository),
						UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
			throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}

	//front end
	@Bean
	FilterRegistrationBean<CorsFilter> corsFilter() {
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		CorsConfiguration config = new CorsConfiguration();
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:3000");
		config.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT"));
		config.setAllowedHeaders(
				Arrays.asList("X-Requested-With", "Origin", "Content-Type", "Accept", "Authorization"));
		source.registerCorsConfiguration("/**", config);
		FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<CorsFilter>(new CorsFilter(source));
		bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
		return bean;
	}
	
}


