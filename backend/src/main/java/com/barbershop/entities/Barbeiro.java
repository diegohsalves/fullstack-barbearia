package com.barbershop.entities;

import java.io.Serializable;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.barbershop.entities.util.Util;
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
@Table(name = "tb_barbeiro")
public class Barbeiro implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@NonNull
	private String nome;
	
	@NonNull
	private Boolean domingo;
	
	@NonNull
	private Boolean segunda;
	
	@NonNull
	private Boolean terca;
	
	@NonNull
	private Boolean quarta;
	
	@NonNull
	private Boolean quinta;
	
	@NonNull
	private Boolean sexta;
	
	@NonNull
	private Boolean sabado;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	@NonNull
	private LocalTime entrada;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	@NonNull
	private LocalTime saida;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	@NonNull
	private LocalTime almoco;
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	@NonNull
	private LocalTime retorno;
	
	@ElementCollection
	@JsonIgnore
	private List<LocalTime> lista = new ArrayList<>();
	
	@OneToMany(mappedBy = "barbeiro", cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<Agendamento> agendamentos = new HashSet<>();
	
	public List<LocalTime> getLista() {
		List<LocalTime> listaInstanciada = Util.preencherAgenda(entrada, saida, almoco, retorno);
		lista = listaInstanciada;
		return lista;
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
		Barbeiro other = (Barbeiro) obj;
		return Objects.equals(id, other.id);
	}

}
