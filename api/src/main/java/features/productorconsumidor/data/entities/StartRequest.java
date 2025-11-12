package features.productorconsumidor.data.entities;

public class StartRequest {
    private int capacidad;
    private int productores;
    private int consumidores;

    public StartRequest() {
    }

    public StartRequest(int capacidad, int productores, int consumidores) {
        this.capacidad = capacidad;
        this.productores = productores;
        this.consumidores = consumidores;
    }

    public int getCapacidad() {
        return capacidad;
    }

    public int getProductores() {
        return productores;
    }

    public int getConsumidores() {
        return consumidores;
    }
}