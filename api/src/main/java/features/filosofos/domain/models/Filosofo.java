package features.filosofos.domain.models;

import features.filosofos.data.entities.EstadoFilosofo;
import features.filosofos.domain.services.IMesaService;

public class Filosofo extends Thread implements AutoCloseable {
    private final int id;
    private volatile EstadoFilosofo estado = EstadoFilosofo.PENSANDO;

    private final IMesaService mesaService;

    public Filosofo(int id, IMesaService mesaService) {
        this.id = id;
        this.mesaService = mesaService;
    }

    public EstadoFilosofo getEstado() {
        return estado;
    }

    @Override
    public void run() {
        try {
            while (true) {
                setEstado(EstadoFilosofo.PENSANDO);
                pensar();

                mesaService.tomarTenedores(id);

                setEstado(EstadoFilosofo.COMIENDO);
                comer();

                mesaService.soltarTenedores(id);
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    public void pensar() throws InterruptedException {
        System.out.println("Filósofo " + id + " pensando...");
        Thread.sleep((long) (Math.random() * 5000));
    }

    public void comer() throws InterruptedException {
        System.out.println("Filósofo " + id + " comiendo...");
        Thread.sleep((long) (Math.random() * 5000));
    }

    private void setEstado(EstadoFilosofo nuevo) {
        this.estado = nuevo;
        
        try {
            mesaService.notifyState(id, nuevo);
        } catch (Exception e) {
            System.out.println("Failed to notify state for filosofo " + id + ": " + e.getMessage());
        }
    }

    @Override
    public void close() {
        this.interrupt();
        System.out.println("Filósofo " + id + " ha sido interrumpido.");
    }
}
