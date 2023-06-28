package com.tevology.spectrum.soportetecnico.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ViajeRestController {

	@GetMapping("/viaje/prueba")
	public String prueba() {
		return "levantado";
	}
}
