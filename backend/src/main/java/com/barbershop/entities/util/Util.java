package com.barbershop.entities.util;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import com.barbershop.entities.Agendamento;
import com.barbershop.entities.Barbeiro;
import com.barbershop.entities.Servico;
import com.barbershop.entities.enums.AgendamentoStatus;
import com.barbershop.entities.exceptions.HorarioIncompativelException;

public class Util {

	static DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm");
	
	static DateTimeFormatter dtf2 = DateTimeFormatter.ofPattern("dd/MM/yyyy");

	public static List<LocalTime> preencherAgenda(LocalTime inicio, LocalTime fim, LocalTime almoco, LocalTime retornoAlmoco) {

		List<LocalTime> listaHorarios = new ArrayList<>();
		List<LocalTime> janelaAlmoco = new ArrayList<>();

		inicio = LocalTime.parse(inicio.format(dtf));
		LocalTime inicioOriginal = inicio;
		fim = LocalTime.parse(fim.format(dtf));

		if (inicio != null && fim != null) {

			if (inicio.isBefore(fim)) {
				listaHorarios.add(inicio);

				while (inicio.isBefore(fim)) {
					inicio = inicio.plusMinutes(10);
					listaHorarios.add(inicio);
				}
				
				janelaAlmoco.add(fim);

				if (almoco != null && retornoAlmoco != null) {
					almoco = LocalTime.parse(almoco.format(dtf));
					retornoAlmoco = LocalTime.parse(retornoAlmoco.format(dtf));

					if ((almoco.equals(inicioOriginal) || almoco.isAfter(inicioOriginal))
							&& (retornoAlmoco.equals(fim) || retornoAlmoco.isBefore(fim))) {

						if (almoco.isBefore(retornoAlmoco)) {
							janelaAlmoco.add(almoco);

							retornoAlmoco = retornoAlmoco.minusMinutes(10);
							
							while (almoco.isBefore(retornoAlmoco)) {
								almoco = almoco.plusMinutes(10);
								janelaAlmoco.add(almoco);
							}

							listaHorarios.removeAll(janelaAlmoco);

						} else {
							throw new HorarioIncompativelException("Horário inicial de almoço precisa ser anterior ao horário de retorno");
						}

					} else {
						throw new HorarioIncompativelException("Horário de almoço precisa estar dentro do expediente");
					}
				}
			} else {
				throw new HorarioIncompativelException("Horário inicial e final não podem ser nulos");
			}

		}

		return listaHorarios;
	}
	
	public static List<LocalTime> horariosDisponiveis(Barbeiro barbeiro, LocalDate dataEscolhida){
		List<LocalTime> listaAtualizada = barbeiro.getLista();
		
		String dataEscolhidaFormatada = dtf2.format(dataEscolhida);
		
		for (Agendamento agendamento : barbeiro.getAgendamentos()) {
			
			String dataAgendada = dtf2.format(agendamento.getData());
			
			if((dataEscolhidaFormatada.equals(dataAgendada)) && (barbeiro.getId() == agendamento.getBarbeiro().getId()) && !agendamento.getStatus().equals(AgendamentoStatus.CANCELADO)) {
				
				LocalTime finalHorario = agendamento.getHorario();
				
				for (Servico servico : agendamento.getServicos()) {

					finalHorario = finalHorario.plusHours(servico.getTempoDuracao().getHour()).plusMinutes(servico.getTempoDuracao().getMinute());
					List<LocalTime> horariosRetirar = Util.horariosOcupados(agendamento.getHorario(), finalHorario);
					listaAtualizada.removeAll(horariosRetirar);
				}
			}
		}

		return listaAtualizada;
	}
	
	public static List<LocalTime> horariosOcupados(LocalTime inicio, LocalTime fim){
		
		List<LocalTime> listaHorarios = new ArrayList<>();

		inicio = LocalTime.parse(inicio.format(dtf));
		fim = LocalTime.parse(fim.format(dtf));

		if (inicio != null && fim != null) {

			if (inicio.isBefore(fim)) {
				listaHorarios.add(inicio);

				while (inicio.isBefore(fim)) {
					inicio = inicio.plusMinutes(10);
					listaHorarios.add(inicio);
				}

			} else {
				throw new HorarioIncompativelException("Horário inicial e final não podem ser nulos");
			}

		}

		return listaHorarios;
	}
	
	public static Boolean encaixeHorario(List<String> horariosDisponiveis, String horarioEscolhido, List<Servico> servicos) {
		
		List<LocalTime> janelaTempoNecessario = new ArrayList<>();
		List<LocalTime> horariosDisponiveisConvertido = new ArrayList<>();
		
		for(String horario : horariosDisponiveis) {
			LocalTime horarioConvertido = LocalTime.parse(horario);
			horariosDisponiveisConvertido.add(horarioConvertido);
		}
		
		LocalTime horarioEscolhidoInicio = LocalTime.parse(horarioEscolhido,dtf);
		LocalTime horarioEscolhidoTermino = horarioEscolhidoInicio;
		
		for(Servico servico : servicos) {
			horarioEscolhidoTermino = horarioEscolhidoTermino.plusHours(servico.getTempoDuracao().getHour()).plusMinutes(servico.getTempoDuracao().getMinute());
		}
		
		janelaTempoNecessario.add(horarioEscolhidoInicio);

		while (horarioEscolhidoInicio.isBefore(horarioEscolhidoTermino)) {
			horarioEscolhidoInicio = horarioEscolhidoInicio.plusMinutes(10);
			janelaTempoNecessario.add(horarioEscolhidoInicio);
		}
		
		janelaTempoNecessario.remove(horarioEscolhidoTermino);

		
		Boolean encaixou = horariosDisponiveisConvertido.containsAll(janelaTempoNecessario);	
		
		return encaixou;
	}
}