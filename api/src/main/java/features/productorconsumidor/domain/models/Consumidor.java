package features.productorconsumidor.domain.models;

import features.productorconsumidor.data.entities.EstadoConsumidor;
import features.productorconsumidor.domain.services.IBufferService;
import libs.Environment;

public class Consumidor extends Thread implements AutoCloseable {
    private final java.util.Random random = new java.util.Random();
    private final int min;
    private final int max;

    private final IBufferService buffer;
    private final int id;

    public Consumidor(IBufferService buffer, int id) {
        this.buffer = buffer;
        this.id = id;

        this.min = Environment.getInt("MIN_CONSUMIDOR_WAIT", 1000);
        this.max = Environment.getInt("MAX_CONSUMIDOR_WAIT", 5000);
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
        Thread.sleep((long) random.nextInt(max - min + 1) + min);
    }

    @Override
    public void close() {
        this.interrupt();
    }
}
