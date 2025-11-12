package features.productorconsumidor.domain.dtos;

public class EstadoProductorDto {
    private final int id;
    private final String estado;

    public EstadoProductorDto(int id, String estado) {
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