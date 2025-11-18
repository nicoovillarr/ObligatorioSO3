package features.productorconsumidor.data.services;

import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.Semaphore;

import org.springframework.stereotype.Service;

import features.productorconsumidor.data.entities.EstadoConsumidor;
import features.productorconsumidor.data.entities.EstadoProductor;
import features.productorconsumidor.domain.dtos.EstadoBufferDto;
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
    public int getSize() {
        return queue.size();
    }

    @Override
    public void producir(int item, int idProductor) throws InterruptedException {
        empty.acquire();
        mutex.acquire();

        addItem(item);
        System.out.println("Productor " + idProductor + " produjo: " + item + " | Buffer: " + queue.size());

        mutex.release();

        // notificarEstadoProductor(idProductor, EstadoProductor.DESCANSANDO);
        // Thread.sleep(2500);

        full.release();
    }

    @Override
    public int consumir(int idConsumidor) throws InterruptedException {
        full.acquire();

        // notificarEstadoConsumidor(idConsumidor, EstadoConsumidor.DESCANSANDO);
        // Thread.sleep(2500);

        mutex.acquire();

        int item = removeItem();
        System.out.println("Consumidor " + idConsumidor + " consumió: " + item + " | Buffer: " + queue.size());

        mutex.release();

        empty.release();

        return item;
    }

    @Override
    public void notificarEstadoConsumidor(int id, EstadoConsumidor estado) {
        EstadoConsumidorDto estadoDto = new EstadoConsumidorDto(id, estado.name());
        BroadcastManager.send("PRODUCTOR_CONSUMIDOR", "UPDATE_CONSUMIDOR", estadoDto);
    }

    @Override
    public void notificarEstadoProductor(int id, EstadoProductor estado) {
        EstadoProductorDto estadoDto = new EstadoProductorDto(id, estado.name());
        BroadcastManager.send("PRODUCTOR_CONSUMIDOR", "UPDATE_PRODUCTOR", estadoDto);
    }

    @Override
    public void notificarEstadoBuffer(int size, int capacity) {
        EstadoBufferDto estadoDto = new EstadoBufferDto(size, capacity);
        BroadcastManager.send("PRODUCTOR_CONSUMIDOR", "UPDATE_BUFFER", estadoDto);
    }

    private void addItem(int item) {
        notificarEstadoBuffer(queue.size() + 1, capacity);
        queue.add(item);
    }

    private int removeItem() {
        notificarEstadoBuffer(queue.size() - 1, capacity);
        return queue.remove();
    }
}
