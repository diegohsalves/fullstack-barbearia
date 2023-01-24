package com.barbershop.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.barbershop.entities.Agendamento;

public interface AgendamentoService {
	
	List<Agendamento> listarAgendamentos();
	Agendamento encontrarPorId(Long id);
	Agendamento cadastrarAgendamento(Agendamento agendamento);
	void deletarAgendamento(Long id);
	Agendamento atualizarAgendamento(Long id, Agendamento agendamento);
	void atualizarDados(Agendamento novoAgendamento, Agendamento agendamento);
	List<LocalTime> horariosDisponiveis(Long id, LocalDate data);
	Boolean encaixeHorario(String horarioEscolhidoInicio, List<String> horariosDisponiveis, List<Long> listaServicos);

}
