package com.tevology.spectrum.soportetecnico.models.entity.auxiliares;

import java.io.Serializable;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ubi_departamento")
public class Departamento implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(length = 2)
	private String codigo;
	
	@Column(length = 100)
	private String descripcion;
	
	@Column(length = 20)
	private String abreviatura;
	
	@CreationTimestamp
	@Column(name = "fecha_carga", updatable = false)
	private OffsetDateTime fechaCarga;
	
	@Column(length = 4000)
	private String grafo;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getAbreviatura() {
		return abreviatura;
	}

	public void setAbreviatura(String abreviatura) {
		this.abreviatura = abreviatura;
	}

	public OffsetDateTime getFechaCarga() {
		return fechaCarga;
	}

	public void setFechaCarga(OffsetDateTime fechaCarga) {
		this.fechaCarga = fechaCarga;
	}

	public String getGrafo() {
		return grafo;
	}

	public void setGrafo(String grafo) {
		this.grafo = grafo;
	}

	private static final long serialVersionUID = 2556721803996586710L;

}
