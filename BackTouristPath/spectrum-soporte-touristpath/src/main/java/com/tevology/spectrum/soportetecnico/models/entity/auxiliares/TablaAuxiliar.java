package com.tevology.spectrum.soportetecnico.models.entity.auxiliares;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "cfg_tabla_auxiliar")
public class TablaAuxiliar implements Serializable {

	@Id
	@Column(name = "cod_tabla_auxiliar",length = 6)
	private String codTablaAuxiliar;

	private String nombre;
	
	@Column(name = "ind_edicion")
	private Boolean indEdicion;

	private String observacion;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "cod_tabla_auxiliar")
	@JsonIgnoreProperties({ "tablaAuxiliarDetalleId", "hibernateLazyInitializer", "handler" })
	@JsonIgnore
	private List<TablaAuxiliarDetalle> detalleAuxiliar;

	@Column(name = "id_usuario_crea")
	private Integer idUsuarioCrea;

	@CreationTimestamp
	@Column(name = "fecha_crea")
	private OffsetDateTime fechaCrea;
	
	public TablaAuxiliar() {
		this.detalleAuxiliar = new ArrayList<TablaAuxiliarDetalle>();
	}

	public String getCodTablaAuxiliar() {
		return codTablaAuxiliar;
	}

	public void setCodTablaAuxiliar(String codTablaAuxiliar) {
		this.codTablaAuxiliar = codTablaAuxiliar;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Boolean getIndEdicion() {
		return indEdicion;
	}

	public void setIndEdicion(Boolean indEdicion) {
		this.indEdicion = indEdicion;
	}

	public String getObservacion() {
		return observacion;
	}

	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}

	public List<TablaAuxiliarDetalle> getDetalleAuxiliar() {
		return detalleAuxiliar;
	}

	public void setDetalleAuxiliar(List<TablaAuxiliarDetalle> detalleAuxiliar) {
		this.detalleAuxiliar = detalleAuxiliar;
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
