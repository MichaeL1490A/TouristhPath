package com.tevology.spectrum.soportetecnico.models.entity.auxiliares;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cfg_parametro")
public class Parametro implements Serializable {

	@Id
	private Integer id;

	@Column(length = 100)
	private String nombre;

	@Column(length = 200)
	private String descripcion;

	@Column(length = 600)
	private String valor;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" }, allowSetters = true)
	private TablaAuxiliarDetalle tipoDato;

	private Boolean indNivelUsuario;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getValor() {
		return valor;
	}

	public void setValor(String valor) {
		this.valor = valor;
	}

	public TablaAuxiliarDetalle getTipoDato() {
		return tipoDato;
	}

	public void setTipoDato(TablaAuxiliarDetalle tipoDato) {
		this.tipoDato = tipoDato;
	}

	public Boolean getIndNivelUsuario() {
		return indNivelUsuario;
	}

	public void setIndNivelUsuario(Boolean indNivelUsuario) {
		this.indNivelUsuario = indNivelUsuario;
	}

	private static final long serialVersionUID = 1L;
}
