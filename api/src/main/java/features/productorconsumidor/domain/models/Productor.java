package features.productorconsumidor.domain.models;

import features.productorconsumidor.data.entities.EstadoProductor;
import features.productorconsumidor.domain.services.IBufferService;

public class Productor extends Thread implements AutoCloseable {
    private final IBufferService buffer;
    private final int id;

    public Productor(IBufferService buffer, int id) {
        this.buffer = buffer;
        this.id = id;
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
        Thread.sleep((long) (Math.random() * 5000));
    }

    @Override
    public void close() {
        this.interrupt();
    }
}
