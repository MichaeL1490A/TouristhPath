package com.tevology.spectrum.soportetecnico.models.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tevology.spectrum.soportetecnico.models.dao.IViajeDao;
import com.tevology.spectrum.soportetecnico.models.entity.viaje.Viaje;

@Service
public class ViajeServiceImpl implements IViajeService {

	@Autowired
	private IViajeDao viajeDao;
	
	@Override
	public Viaje save(Viaje viaje) {
		return viajeDao.save(viaje);
	}
	@Override
	public Viaje findViajeById(Integer viajeId) {
		return viajeDao.findViajeById(viajeId);
	}




}
