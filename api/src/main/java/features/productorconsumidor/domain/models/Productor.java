package features.productorconsumidor.domain.models;

import features.productorconsumidor.data.entities.EstadoProductor;
import features.productorconsumidor.domain.services.IBufferService;
import libs.Environment;

public class Productor extends Thread implements AutoCloseable {
    private final java.util.Random random = new java.util.Random();
    private final int min;
    private final int max;

    private final IBufferService buffer;
    private final int id;

    public Productor(IBufferService buffer, int id) {
        this.buffer = buffer;
        this.id = id;

        this.min = Environment.getInt("MIN_PRODUCTOR_WAIT", 1000);
        this.max = Environment.getInt("MAX_PRODUCTOR_WAIT", 5000);
    }

    @Override
    @SuppressWarnings("BusyWait")
    public void run() {
        try {
            int item = 0;
            while (true) {
                buffer.notificarEstadoProductor(id, EstadoProductor.ESPERANDO);
                producir(++item);
            }
        } catch (InterruptedException e) {
            System.out.println("Productor " + id + " detenido.");
        }
    }

    private void producir(int item) throws InterruptedException {
        buffer.producir(item, id);
        buffer.notificarEstadoProductor(id, EstadoProductor.PRODUCIENDO);
        Thread.sleep((long) random.nextInt(max - min + 1) + min);
    }

    @Override
    public void close() {
        this.interrupt();
    }
}
