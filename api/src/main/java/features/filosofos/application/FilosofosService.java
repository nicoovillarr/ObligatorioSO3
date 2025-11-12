package features.filosofos.application;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import features.filosofos.domain.services.IMesaService;

@Service
public class FilosofosService implements AutoCloseable {
    private final IMesaService mesa;

    @Autowired
    public FilosofosService(IMesaService mesa) {
        this.mesa = mesa;
    }

    @Override
    public void close() {
        mesa.close();
    }

    public void iniciar(int filosofos) {
        this.mesa.setCapacity(filosofos);
        
        this.mesa.inicializarTenedores();
        this.mesa.inicializarFilosofos();
        
        mesa.iniciar();
    }
}