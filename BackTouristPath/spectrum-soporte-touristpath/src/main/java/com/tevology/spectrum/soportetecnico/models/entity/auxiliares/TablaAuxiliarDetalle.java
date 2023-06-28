package com.tevology.spectrum.soportetecnico.models.entity.auxiliares;

import java.io.Serializable;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "cfg_tabla_auxiliar_detalle")
public class TablaAuxiliarDetalle implements Serializable {

	@EmbeddedId
	private TablaAuxiliarDetalleId tablaAuxiliarDetalleId;

	private String nombre;

	private String abreviatura;

	private String valor;

	private String valor2;

	@Column(length=600)
	private String observacion;
	
	@Column(name = "ind_habilitado")
	private Boolean indHabilitado;

	@Column(name = "id_usuario_crea")
	private Integer idUsuarioCrea;

	@CreationTimestamp
	@Column(name = "fecha_crea")
	private OffsetDateTime fechaCrea;

	public TablaAuxiliarDetalleId getTablaAuxiliarDetalleId() {
		return tablaAuxiliarDetalleId;
	}

	public void setTablaAuxiliarDetalleId(TablaAuxiliarDetalleId tablaAuxiliarDetalleId) {
		this.tablaAuxiliarDetalleId = tablaAuxiliarDetalleId;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getAbreviatura() {
		return abreviatura;
	}

	public void setAbreviatura(String abreviatura) {
		this.abreviatura = abreviatura;
	}

	public String getValor() {
		return valor;
	}

	public void setValor(String valor) {
		this.valor = valor;
	}

	public String getValor2() {
		return valor2;
	}

	public void setValor2(String valor2) {
		this.valor2 = valor2;
	}

	public String getObservacion() {
		return observacion;
	}

	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}

	public Boolean getIndHabilitado() {
		return indHabilitado;
	}

	public void setIndHabilitado(Boolean indHabilitado) {
		this.indHabilitado = indHabilitado;
	}

	public Integer getIdUsuarioCrea() {
		return idUsuarioCrea;
	}

	public void setIdUsuarioCrea(Integer idUsuarioCrea) {
		this.idUsuarioCrea = idUsuarioCrea;
	}

	public OffsetDateTime getFechaCrea() {
		return fechaCrea;
	}

	private static final long serialVersionUID = 1L;
}
