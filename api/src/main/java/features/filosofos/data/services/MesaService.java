package features.filosofos.data.services;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;

import org.springframework.stereotype.Service;

import features.filosofos.data.entities.EstadoFilosofo;
import features.filosofos.domain.dtos.EstadoFilosofoDto;
import features.filosofos.domain.models.Filosofo;
import features.filosofos.domain.services.IMesaService;
import libs.BroadcastManager;

@Service
public class MesaService implements IMesaService {
    private int capacity;
    private Semaphore[] tenedores;
    private final List<Filosofo> filosofos = new ArrayList<>();

    public MesaService() {
    }

    @Override
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public int getCapacity() {
        return capacity;
    }

    @Override
    public void inicializarTenedores() {
        tenedores = new Semaphore[capacity];
        for (int i = 0; i < capacity; i++) {
            tenedores[i] = new Semaphore(1);
        }
    }

    @Override
    public void inicializarFilosofos() {
        for (int i = 0; i < capacity; i++) {
            agregarFilosofo(i);
        }
    }

    @Override
    public void iniciar() {
        filosofos.forEach(Filosofo::start);
    }

    @Override
    public void tomarTenedores(int i) throws InterruptedException {
        int izquierda = left(i);
        int derecha = right(i);

        if (i == capacity - 1) {
            tenedores[derecha].acquire();
            tenedores[izquierda].acquire();
        } else {
            tenedores[izquierda].acquire();
            tenedores[derecha].acquire();
        }
    }

    @Override
    public void soltarTenedores(int i) {
        tenedores[left(i)].release();
        tenedores[right(i)].release();
    }

    @Override
    public void notifyState(int id, EstadoFilosofo estado) {
        EstadoFilosofoDto dto = new EstadoFilosofoDto(id, estado.name());
        BroadcastManager.send("ESTADO_FILOSOFO", "UPDATE", dto);
    }

    @Override
    public void close() {
        filosofos.forEach(Filosofo::close);
        System.out.println("Todos los filósofos han sido interrumpidos.");

        filosofos.clear();
        tenedores = null;
        capacity = 0;
    }

    private void agregarFilosofo(int i) {
        Filosofo filosofo = new Filosofo(i, this);
        filosofos.add(filosofo);
    }

    private int left(int i) {
        return i;
    }

    private int right(int i) {
        return (i + 1) % capacity;
    }
}
