package features.productorconsumidor.domain.services;

import features.productorconsumidor.data.entities.EstadoConsumidor;
import features.productorconsumidor.data.entities.EstadoProductor;

public interface IBufferService {
    void setCapacity(int capacity);
    int getCapacity();
    
    void producir(int item, int idProductor) throws InterruptedException;
    int consumir(int idConsumidor) throws InterruptedException;

    void notificarEstadoConsumidor(int id, EstadoConsumidor estado);
    void notificarEstadoProductor(int id, EstadoProductor estado);
}
