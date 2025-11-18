package features.filosofos.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import features.filosofos.domain.services.IMesaService;

@Service
public class FilosofosService implements AutoCloseable {
    private static boolean isRunning = false;
    private static final Object lock = new Object();
    private static int filosofosCount = 0;

    private final IMesaService mesa;

    @Autowired
    public FilosofosService(IMesaService mesa) {
        this.mesa = mesa;
    }

    @Override
    public void close() {
        mesa.close();

        synchronized (lock) {
            isRunning = false;
            filosofosCount = 0;
        }
    }

    public void iniciar(int filosofos) {
        this.mesa.setCapacity(filosofos);

        this.mesa.inicializarTenedores();
        this.mesa.inicializarFilosofos();

        mesa.iniciar();

        synchronized (lock) {
            isRunning = true;
            filosofosCount = filosofos;
        }
    }

    public void reiniciar() {
        close();
        iniciar(filosofosCount);
    }

    public boolean estado() {
        synchronized (lock) {
            return isRunning;
        }
    }

    public int getFilosofosCount() {
        synchronized (lock) {
            return filosofosCount;
        }
    }
}