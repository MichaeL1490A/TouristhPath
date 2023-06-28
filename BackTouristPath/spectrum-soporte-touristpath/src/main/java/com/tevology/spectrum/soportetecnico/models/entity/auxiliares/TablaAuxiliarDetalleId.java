package com.tevology.spectrum.soportetecnico.models.entity.auxiliares;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Embeddable;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Embeddable
public class TablaAuxiliarDetalleId implements Serializable {

	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cod_tabla_auxiliar", columnDefinition = "varchar(6)")
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	private TablaAuxiliar tablaAuxiliar;

	public TablaAuxiliarDetalleId() {
	}

	public TablaAuxiliarDetalleId(Integer id, TablaAuxiliar tablaAuxiliar) {
		this.id = id;
		this.tablaAuxiliar = tablaAuxiliar;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public TablaAuxiliar getTablaAuxiliar() {
		return tablaAuxiliar;
	}

	public void setTablaAuxiliar(TablaAuxiliar tablaAuxiliar) {
		this.tablaAuxiliar = tablaAuxiliar;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!(obj instanceof TablaAuxiliarDetalleId))
			return false;
		TablaAuxiliarDetalleId that = (TablaAuxiliarDetalleId) obj;
		return Objects.equals(getId(), that.getId())
				&& Objects.equals(getTablaAuxiliar(), that.getTablaAuxiliar());
	}

	@Override
	public int hashCode() {
		return Objects.hash(getId(), getTablaAuxiliar());
	}

	private static final long serialVersionUID = 1L;
}
