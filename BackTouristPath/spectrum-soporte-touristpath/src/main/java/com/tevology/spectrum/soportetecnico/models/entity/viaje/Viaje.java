package com.tevology.spectrum.soportetecnico.models.entity.viaje;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;


import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tevology.spectrum.soportetecnico.models.entity.auxiliares.Distrito;
import com.tevology.spectrum.soportetecnico.models.entity.auxiliares.TablaAuxiliarDetalle;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "mae_viaje")
public class Viaje implements Serializable{

	private static final long serialVersionUID = 7038610061979037808L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(length=500)
	private String descripcion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
	private TablaAuxiliarDetalle estado;
	
	private Integer totalPasajeros;

	@Column(name = "id_usuario_crea", updatable = false)
	private Integer idUsuarioCrea;

	@Column(name = "id_usuario_modifica")
	private Integer idUsuarioModifica;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler"}, allowSetters = true)
	private TablaAuxiliarDetalle oferta;
	
	@Column(length=100)
	private String serviciosVip;

	@Column(length=100)
	private String origenTerminalSalida;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" })
	private Distrito origenDistrito;

	@Column(length=100)
	private String origenDireccion;
	
	@Column(length=100)
	private String destinoTerminalLlegada;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" })
	private Distrito destinoDistrito;

	@Column(length=100)
	private String destinoDireccion;
	
	private Integer calificacionSuma;
	
	private Integer calificacionCantidad;
	
	@Column(name = "dia_salida")
	private OffsetDateTime diaSalida;

	private Integer pasajeros;
	
	@Column(columnDefinition="Numeric(10,2)")
	private Double precioRegular;

	@Column(columnDefinition="Numeric(10,2)")
	private Double precioVip;
	
	private Boolean reembolsable;
	
	private Integer horasViaje;
	
	@CreationTimestamp
	@Column(name = "fecha_crea", updatable = false)
	private OffsetDateTime fechaCrea;
		
	@Column(name = "fecha_modifica")
	private OffsetDateTime fechaModifica;
	
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.MERGE)
	@JoinColumn(name = "pasajero")
	private List<ViajePasajero> pasajero;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public TablaAuxiliarDetalle getEstado() {
		return estado;
	}

	public void setEstado(TablaAuxiliarDetalle estado) {
		this.estado = estado;
	}

	public Integer getTotalPasajeros() {
		return totalPasajeros;
	}

	public void setTotalPasajeros(Integer totalPasajeros) {
		this.totalPasajeros = totalPasajeros;
	}

	public Integer getIdUsuarioCrea() {
		return idUsuarioCrea;
	}

	public void setIdUsuarioCrea(Integer idUsuarioCrea) {
		this.idUsuarioCrea = idUsuarioCrea;
	}

	public Integer getIdUsuarioModifica() {
		return idUsuarioModifica;
	}

	public void setIdUsuarioModifica(Integer idUsuarioModifica) {
		this.idUsuarioModifica = idUsuarioModifica;
	}

	public TablaAuxiliarDetalle getOferta() {
		return oferta;
	}

	public void setOferta(TablaAuxiliarDetalle oferta) {
		this.oferta = oferta;
	}

	public String getServiciosVip() {
		return serviciosVip;
	}

	public void setServiciosVip(String serviciosVip) {
		this.serviciosVip = serviciosVip;
	}

	public String getOrigenTerminalSalida() {
		return origenTerminalSalida;
	}

	public void setOrigenTerminalSalida(String origenTerminalSalida) {
		this.origenTerminalSalida = origenTerminalSalida;
	}

	public Distrito getOrigenDistrito() {
		return origenDistrito;
	}

	public void setOrigenDistrito(Distrito origenDistrito) {
		this.origenDistrito = origenDistrito;
	}

	public String getOrigenDireccion() {
		return origenDireccion;
	}

	public void setOrigenDireccion(String origenDireccion) {
		this.origenDireccion = origenDireccion;
	}

	public String getDestinoTerminalLlegada() {
		return destinoTerminalLlegada;
	}

	public void setDestinoTerminalLlegada(String destinoTerminalLlegada) {
		this.destinoTerminalLlegada = destinoTerminalLlegada;
	}

	public Distrito getDestinoDistrito() {
		return destinoDistrito;
	}

	public void setDestinoDistrito(Distrito destinoDistrito) {
		this.destinoDistrito = destinoDistrito;
	}

	public String getDestinoDireccion() {
		return destinoDireccion;
	}

	public void setDestinoDireccion(String destinoDireccion) {
		this.destinoDireccion = destinoDireccion;
	}

	public Integer getCalificacionSuma() {
		return calificacionSuma;
	}

	public void setCalificacionSuma(Integer calificacionSuma) {
		this.calificacionSuma = calificacionSuma;
	}

	public Integer getCalificacionCantidad() {
		return calificacionCantidad;
	}

	public void setCalificacionCantidad(Integer calificacionCantidad) {
		this.calificacionCantidad = calificacionCantidad;
	}

	public OffsetDateTime getDiaSalida() {
		return diaSalida;
	}

	public void setDiaSalida(OffsetDateTime diaSalida) {
		this.diaSalida = diaSalida;
	}

	public Integer getPasajeros() {
		return pasajeros;
	}

	public void setPasajeros(Integer pasajeros) {
		this.pasajeros = pasajeros;
	}

	public Double getPrecioRegular() {
		return precioRegular;
	}

	public void setPrecioRegular(Double precioRegular) {
		this.precioRegular = precioRegular;
	}

	public Double getPrecioVip() {
		return precioVip;
	}

	public void setPrecioVip(Double precioVip) {
		this.precioVip = precioVip;
	}

	public Boolean getReembolsable() {
		return reembolsable;
	}

	public void setReembolsable(Boolean reembolsable) {
		this.reembolsable = reembolsable;
	}

	public Integer getHorasViaje() {
		return horasViaje;
	}

	public void setHorasViaje(Integer horasViaje) {
		this.horasViaje = horasViaje;
	}

	public OffsetDateTime getFechaCrea() {
		return fechaCrea;
	}

	public void setFechaCrea(OffsetDateTime fechaCrea) {
		this.fechaCrea = fechaCrea;
	}

	public OffsetDateTime getFechaModifica() {
		return fechaModifica;
	}

	public void setFechaModifica(OffsetDateTime fechaModifica) {
		this.fechaModifica = fechaModifica;
	}

	public List<ViajePasajero> getPasajero() {
		return pasajero;
	}

	public void setPasajero(List<ViajePasajero> pasajero) {
		this.pasajero = pasajero;
	}
}
