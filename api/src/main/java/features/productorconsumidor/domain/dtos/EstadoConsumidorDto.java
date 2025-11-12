package features.productorconsumidor.domain.dtos;

public class EstadoConsumidorDto {
    private final int id;
    private final String estado;

    public EstadoConsumidorDto(int id, String estado) {
        this.id = id;
        this.estado = estado;
    }

    public int getId() {
        return id;
    }

    public String getEstado() {
        return estado;
    }
}