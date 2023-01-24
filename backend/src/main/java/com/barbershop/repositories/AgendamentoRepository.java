package com.barbershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbershop.entities.Agendamento;

public interface AgendamentoRepository extends JpaRepository<Agendamento, Long>{

}
