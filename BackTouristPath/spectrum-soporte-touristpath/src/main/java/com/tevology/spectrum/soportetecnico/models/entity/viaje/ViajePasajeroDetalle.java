package com.tevology.spectrum.soportetecnico.models.entity.viaje;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tevology.spectrum.soportetecnico.models.entity.auxiliares.TablaAuxiliarDetalle;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "via_viaje_pasajero_detalle")
public class ViajePasajeroDetalle implements Serializable{

	private static final long serialVersionUID = 7038610061979037808L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(length = 200)
	private String nombresApellidos;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
	private TablaAuxiliarDetalle sexo;
	
	private Integer edad;
	
	@Column(length = 200)
	private String correo;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
	private TablaAuxiliarDetalle boleto;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" }, allowSetters = true)
	private ViajePasajero pasajero;


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombresApellidos() {
		return nombresApellidos;
	}

	public void setNombresApellidos(String nombresApellidos) {
		this.nombresApellidos = nombresApellidos;
	}

	public TablaAuxiliarDetalle getSexo() {
		return sexo;
	}

	public void setSexo(TablaAuxiliarDetalle sexo) {
		this.sexo = sexo;
	}

	public Integer getEdad() {
		return edad;
	}

	public void setEdad(Integer edad) {
		this.edad = edad;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public TablaAuxiliarDetalle getBoleto() {
		return boleto;
	}

	public void setBoleto(TablaAuxiliarDetalle boleto) {
		this.boleto = boleto;
	}

	public ViajePasajero getPasajero() {
		return pasajero;
	}

	public void setPasajero(ViajePasajero pasajero) {
		this.pasajero = pasajero;
	}
}
