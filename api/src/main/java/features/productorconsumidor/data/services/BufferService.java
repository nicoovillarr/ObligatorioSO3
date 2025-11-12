package features.productorconsumidor.data.services;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.Semaphore;

import org.springframework.stereotype.Service;

import features.productorconsumidor.data.entities.EstadoConsumidor;
import features.productorconsumidor.data.entities.EstadoProductor;
import features.productorconsumidor.domain.dtos.EstadoConsumidorDto;
import features.productorconsumidor.domain.dtos.EstadoProductorDto;
import features.productorconsumidor.domain.services.IBufferService;
import libs.BroadcastManager;

@Service
public class BufferService implements IBufferService {
    private int capacity;

    private final Queue<Integer> queue = new LinkedList<>();

    private Semaphore empty;
    private final Semaphore mutex = new Semaphore(1);
    private final Semaphore full = new Semaphore(0);

    public BufferService() {
    }

    @Override
    public void setCapacity(int capacity) {
        this.capacity = capacity;
        this.empty = new Semaphore(capacity);
    }

    @Override
    public int getCapacity() {
        return capacity;
    }

    @Override
    public void producir(int item, int idProductor) throws InterruptedException {
        empty.acquire();
        mutex.acquire();

        queue.add(item);
        System.out.println("Productor " + idProductor + " produjo: " + item + " | Buffer: " + queue.size());

        mutex.release();
        full.release();
    }

    @Override
    public int consumir(int idConsumidor) throws InterruptedException {
        full.acquire();
        mutex.acquire();

        int item = queue.remove();
        System.out.println("Consumidor " + idConsumidor + " consumió: " + item + " | Buffer: " + queue.size());

        mutex.release();
        empty.release();

        return item;
    }
    
    @Override
    public void notificarEstadoConsumidor(int id, EstadoConsumidor estado) {
        EstadoConsumidorDto estadoDto = new EstadoConsumidorDto(id, estado.name());
        BroadcastManager.send("ESTADO_CONSUMIDOR","UPDATE", estadoDto);
    }

    @Override
    public void notificarEstadoProductor(int id, EstadoProductor estado) {
        EstadoProductorDto estadoDto = new EstadoProductorDto(id, estado.name());
        BroadcastManager.send("ESTADO_PRODUCTOR","UPDATE", estadoDto);
    }
}
