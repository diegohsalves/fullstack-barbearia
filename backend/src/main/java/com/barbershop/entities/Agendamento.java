package com.barbershop.entities;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.barbershop.entities.enums.AgendamentoStatus;
import com.barbershop.entities.enums.FormaPagamento;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "tb_agendamento")
public class Agendamento implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "cliente_id")
	@NonNull
	private Cliente cliente;

	@ManyToOne
	@JoinColumn(name = "barbeiro_id")
	@NonNull
	private Barbeiro barbeiro;

	@ManyToMany
	@JoinTable(name = "tb_agendamento_servico", joinColumns = @JoinColumn(name = "agendamento_id"), inverseJoinColumns = @JoinColumn(name = "servico_id"))
	private Set<Servico> servicos = new HashSet<>();

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy")
	@NonNull
	private LocalDate data;

	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	@NonNull
	private LocalTime horario;

	private BigDecimal total;

	private String observacao;

	private FormaPagamento formaPagamento;

	private AgendamentoStatus status = AgendamentoStatus.CONFIRMADO;

	@ManyToOne
	@JsonIgnore
	private Extrato extrato;

	public BigDecimal getTotal() {
		total = BigDecimal.ZERO;

		if (servicos != null) {

			for (Servico servico : servicos) {
				total = total.add(servico.getPreco());
			}
		}

		return total;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Agendamento other = (Agendamento) obj;
		return Objects.equals(id, other.id);
	}

}
