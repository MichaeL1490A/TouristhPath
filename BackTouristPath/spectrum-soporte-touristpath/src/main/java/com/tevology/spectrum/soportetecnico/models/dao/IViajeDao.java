package com.tevology.spectrum.soportetecnico.models.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.tevology.spectrum.soportetecnico.models.entity.viaje.Viaje;


public interface IViajeDao extends JpaRepository <Viaje, Integer> {

	@Query(value="select v from Viaje v where v.id = :viajeId", nativeQuery=false)
	public Viaje findViajeById(Integer viajeId);

}
