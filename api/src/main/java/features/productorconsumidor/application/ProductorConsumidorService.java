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
            productores.add(new Productor(buffer, i + 1));
        }
        
        for (int i = 0; i < numConsumidores; i++) {
            consumidores.add(new Consumidor(buffer, i + 1));
        }

        productores.forEach(Thread::start);
        consumidores.forEach(Thread::start);
    }

    @Override
    public void close() {
        productores.forEach(Productor::close);
        consumidores.forEach(Consumidor::close);
    }
}
