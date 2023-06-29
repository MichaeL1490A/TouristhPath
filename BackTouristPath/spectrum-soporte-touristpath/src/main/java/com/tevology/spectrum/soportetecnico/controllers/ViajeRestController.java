package com.tevology.spectrum.soportetecnico.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tevology.spectrum.soportetecnico.models.entity.viaje.Viaje;
import com.tevology.spectrum.soportetecnico.models.service.IViajeService;


@RestController
public class ViajeRestController {

	@Autowired
	private IViajeService viajeService;
	
	@GetMapping("/viaje/prueba")
	public String prueba() {
		return "levantado";
	}

	@PostMapping("/viaje/create")
	public ResponseEntity<?> crearMarca(@RequestBody Viaje viaje,
			@RequestParam(value="usuarioId", required=true) Integer usuarioId){
		Viaje viajeNuevo = null;
		Map<String, Object> response = new HashMap<>();
				
		try {
			viaje.setIdUsuarioCrea(usuarioId);
			viajeNuevo = viajeService.save(viaje);			
		}catch(DataAccessException e) {
			response.put("mensaje", "Error al crear nueva marca en la BD");
			response.put("error", e.getMessage().concat(": ").concat(e.getMostSpecificCause().toString()));
			return new ResponseEntity<Map<String, Object>>(response, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		response.put("mensaje", "Marca creada con éxito");
		response.put("viaje", viajeNuevo);
		return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
		
	}

	@GetMapping("/viaje/find/{viajeId}")
	public Viaje findById(@PathVariable Integer viajeId) {
		return viajeService.findViajeById(viajeId);
	}
}
