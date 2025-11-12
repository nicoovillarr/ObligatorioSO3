package features.filosofos.domain.services;

import features.filosofos.data.entities.EstadoFilosofo;

public interface IMesaService extends AutoCloseable {
    void setCapacity(int capacity);
    int getCapacity();

    void inicializarTenedores();
    void inicializarFilosofos();

    void iniciar();

    void tomarTenedores(int i) throws InterruptedException;
    void soltarTenedores(int i);
    void notifyState(int id, EstadoFilosofo estado);
    
    @Override
    void close();
}