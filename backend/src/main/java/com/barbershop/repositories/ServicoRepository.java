package com.barbershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbershop.entities.Servico;

public interface ServicoRepository extends JpaRepository<Servico, Long> {

}
