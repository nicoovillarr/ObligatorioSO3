package  features.filosofos.domain.dtos;

public class EstadoFilosofoDto {
    private final int id;
    private final String estado;

    public EstadoFilosofoDto(int id, String estado) {
        this.id = id;
        this.estado = estado;
    }

    public int getId() {
        return id;
    }

    public String getEstado() {
        return estado;
    }

    @Override
    public String toString() {
        return "{\"id\":" + id + ",\"estado\":\"" + estado + "\"}";
    }
}