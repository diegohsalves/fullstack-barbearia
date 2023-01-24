package com.barbershop.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.barbershop.entities.Barbeiro;

public interface BarbeiroRepository extends JpaRepository<Barbeiro, Long> {

}
