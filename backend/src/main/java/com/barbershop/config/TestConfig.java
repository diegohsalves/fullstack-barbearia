package com.barbershop.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.barbershop.entities.Agendamento;
import com.barbershop.entities.Barbeiro;
import com.barbershop.entities.Cliente;
import com.barbershop.entities.Extrato;
import com.barbershop.entities.Servico;
import com.barbershop.entities.Usuario;
import com.barbershop.entities.enums.AgendamentoStatus;
import com.barbershop.entities.enums.FormaPagamento;
import com.barbershop.repositories.AgendamentoRepository;
import com.barbershop.repositories.BarbeiroRepository;
import com.barbershop.repositories.ClienteRepository;
import com.barbershop.repositories.ExtratoRepository;
import com.barbershop.repositories.ServicoRepository;
import com.barbershop.repositories.UsuarioRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner{

	@Autowired
	UsuarioRepository usuarioRepository;
	
	@Autowired
	ClienteRepository clienteRepository;
	
	@Autowired
	ServicoRepository servicoRepository;
	
	@Autowired
	BarbeiroRepository barbeiroRepository;
	
	@Autowired
	AgendamentoRepository agendamentoRepository;
	
	@Autowired
	ExtratoRepository extratoRepository;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Override
	public void run(String... args) throws Exception {
		
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");

		Boolean domingo = false;
		Boolean segunda = true;
		Boolean terca = true;
		Boolean quarta = true;
		Boolean quinta = true;
		Boolean sexta = true;
		Boolean sabado = false;

		LocalTime entrada = LocalTime.parse("09:00", dtf);
		LocalTime saida = LocalTime.parse("18:00", dtf);

		LocalTime almoco = LocalTime.parse("12:00", dtf);
		LocalTime retorno = LocalTime.parse("14:00", dtf);
		
		Barbeiro barbeiro1 = new Barbeiro("Barba Roxa", domingo, segunda, terca, quarta, quinta, sexta, sabado, entrada, saida, almoco, retorno);
		Barbeiro barbeiro2 = new Barbeiro("Barba Azul", domingo, segunda, terca, quarta, quinta, sexta, sabado, entrada, saida, almoco, retorno);
		Barbeiro barbeiro3 = new Barbeiro("Barba Vermelha", domingo, segunda, terca, quarta, quinta, sexta, sabado, entrada, saida, almoco, retorno);
		
		barbeiroRepository.saveAll(Arrays.asList(barbeiro1, barbeiro2, barbeiro3));
		
		Usuario usuario1 = new Usuario("fulanoalves", passwordEncoder.encode("123456"));
		Usuario usuario2 = new Usuario("ciclanomartins", passwordEncoder.encode("123456"));
		Usuario usuario3 = new Usuario("beltranogreyjoy", passwordEncoder.encode("123456"));
		
		usuarioRepository.saveAll(Arrays.asList(usuario1, usuario2, usuario3));
		
		Cliente cliente1 = new Cliente("Fulano de tal", "fulanodetal@gmail.com", "866.172.026-51");
		cliente1.setTelefone("(34) 3842-4436");
		Cliente cliente2 = new Cliente("Ciclano de tal", "ciclanodetal@gmail.com", "934.642.706-02");
		cliente2.setTelefone("(34) 3842-4436");
		Cliente cliente3 = new Cliente("Beltrano de tal", "beltranodetal@gmail.com", "218.207.710-32");
		cliente3.setTelefone("(34) 3842-4436");
		
		LocalTime tempoDuracao = LocalTime.of(0, 30);
		
		Servico servico1 = new Servico("Corte de cabelo", new BigDecimal("35.0"), tempoDuracao);
		Servico servico2 = new Servico("Barba", new BigDecimal("15.0"), tempoDuracao);
		Servico servico3 = new Servico("Alisamento", new BigDecimal("45.0"), tempoDuracao);
		
		servicoRepository.saveAll(Arrays.asList(servico1, servico2, servico3));
		
		
		barbeiroRepository.saveAll(Arrays.asList(barbeiro1, barbeiro2, barbeiro3));
		
		LocalTime horario1 = LocalTime.parse("15:00", dtf);
		LocalTime horario2 = LocalTime.parse("16:00", dtf);
		LocalTime horario3 = LocalTime.parse("14:00", dtf);
		
		LocalDate data = LocalDate.now();
		
		Agendamento agendamento1 = new Agendamento(cliente1, barbeiro1, data, horario1);
		Agendamento agendamento2 = new Agendamento(cliente2, barbeiro2, data, horario2);
		Agendamento agendamento3 = new Agendamento(cliente3, barbeiro3, data, horario3);
		
		agendamento1.getServicos().add(servico2);
		agendamento1.getServicos().add(servico3);
		agendamento2.getServicos().add(servico2);
		agendamento2.getServicos().add(servico3);
		agendamento3.getServicos().add(servico1);
		
		agendamento1.getTotal();
		agendamento2.getTotal();
		agendamento3.getTotal();
		
		agendamento1.setStatus(AgendamentoStatus.CONFIRMADO);
		agendamento2.setStatus(AgendamentoStatus.CANCELADO);
		agendamento3.setStatus(AgendamentoStatus.CONFIRMADO);
		
		agendamento1.setFormaPagamento(FormaPagamento.DINHEIRO);
		agendamento3.setFormaPagamento(FormaPagamento.CREDITO);
		
		servicoRepository.saveAll(Arrays.asList(servico1, servico2, servico3));
		clienteRepository.saveAll(Arrays.asList(cliente1, cliente2, cliente3));
		agendamentoRepository.saveAll(Arrays.asList(agendamento1, agendamento2, agendamento3));
		
		agendamentoRepository.saveAll(Arrays.asList(agendamento1, agendamento2, agendamento3));
		
		Extrato extrato1 = new Extrato(LocalDateTime.now());

		extrato1.getAgendamentos().add(agendamento1);
		extrato1.getAgendamentos().add(agendamento2);
		extrato1.getAgendamentos().add(agendamento3);
		
		extratoRepository.save(extrato1);
		
		agendamento1.setExtrato(extrato1);
		agendamento2.setExtrato(extrato1);
		agendamento3.setExtrato(extrato1);
		
		agendamentoRepository.saveAll(Arrays.asList(agendamento1, agendamento2, agendamento3));

	}

}
