package features.productorconsumidor.application;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import features.productorconsumidor.domain.models.Consumidor;
import features.productorconsumidor.domain.models.Productor;
import features.productorconsumidor.domain.services.IBufferService;

@Service
public class ProductorConsumidorService implements AutoCloseable {
    private static boolean isRunning = false;
    private static final Object lock = new Object();
    private static int productoresCount = 0;
    private static int consumidoresCount = 0;

    private final IBufferService buffer;
    private final List<Productor> productores = new ArrayList<>();
    private final List<Consumidor> consumidores = new ArrayList<>();

    @Autowired
    public ProductorConsumidorService(IBufferService buffer) {
        this.buffer = buffer;
    }

    public void iniciar(int capacity, int numProductores, int numConsumidores) {
        buffer.setCapacity(capacity);

        for (int i = 0; i < numProductores; i++) {
            productores.add(new Productor(buffer, i));
        }

        for (int i = 0; i < numConsumidores; i++) {
            consumidores.add(new Consumidor(buffer, i));
        }

        productores.forEach(Thread::start);
        consumidores.forEach(Thread::start);

        synchronized (lock) {
            isRunning = true;
            productoresCount = numProductores;
            consumidoresCount = numConsumidores;
        }
    }

    @Override
    public void close() {
        productores.forEach(Productor::close);
        productores.clear();

        consumidores.forEach(Consumidor::close);
        consumidores.clear();

        synchronized (lock) {
            isRunning = false;
            productoresCount = 0;
            consumidoresCount = 0;
        }
    }

    public void reiniciar() {
        close();
        iniciar(buffer.getCapacity(), productoresCount, consumidoresCount);
    }

    public boolean estado() {
        synchronized (lock) {
            return isRunning;
        }
    }

    public int getBufferSize() {
        return buffer.getSize();
    }

    public int getBufferCapacity() {
        return buffer.getCapacity();
    }

    public int getProductoresCount() {
        synchronized (lock) {
            return productoresCount;
        }
    }

    public int getConsumidoresCount() {
        synchronized (lock) {
            return consumidoresCount;
        }
    }
}