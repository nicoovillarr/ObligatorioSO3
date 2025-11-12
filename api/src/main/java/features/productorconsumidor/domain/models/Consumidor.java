package features.productorconsumidor.domain.models;

import features.productorconsumidor.data.entities.EstadoConsumidor;
import features.productorconsumidor.domain.services.IBufferService;

public class Consumidor extends Thread implements AutoCloseable {
    private final IBufferService buffer;
    private final int id;

    public Consumidor(IBufferService buffer, int id) {
        this.buffer = buffer;
        this.id = id;
    }

    @Override
    @SuppressWarnings("BusyWait")
    public void run() {
        try {
            while (true) {
                buffer.notificarEstadoConsumidor(id, EstadoConsumidor.ESPERANDO);
                consumir();
            }
        } catch (InterruptedException e) {
            System.out.println("Consumidor " + id + " detenido.");
        }
    }

    private void consumir() throws InterruptedException {
        buffer.consumir(id);
        buffer.notificarEstadoConsumidor(id, EstadoConsumidor.CONSUMIENDO);
        Thread.sleep((long) (Math.random() * 5000));
    }

    @Override
    public void close() {
        this.interrupt();
    }
}
