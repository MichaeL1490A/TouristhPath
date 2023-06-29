package com.tevology.spectrum.soportetecnico.models.service;

import java.util.Map;

import com.tevology.spectrum.soportetecnico.models.entity.viaje.Viaje;


public interface IViajeService {

	public Viaje save(Viaje viaje);
	public Viaje findViajeById(Integer viajeId);
}

