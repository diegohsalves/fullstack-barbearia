package com.barbershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbershop.entities.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

}
