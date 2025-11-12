package features.productorconsumidor.presentation;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import features.productorconsumidor.application.ProductorConsumidorService;
import features.productorconsumidor.data.entities.StartRequest;

@RestController
@RequestMapping("/productor-consumidor")
public class ProductorConsumidorController {
    private final ProductorConsumidorService service;

    public ProductorConsumidorController(ProductorConsumidorService service) {
        this.service = service;
    }

    @PostMapping("/iniciar")
    public String start(@RequestBody StartRequest request) {
        service.iniciar(request.getCapacidad(), request.getProductores(), request.getConsumidores());
        return "Simulación iniciada.";
    }

    @PostMapping("/detener")
    public String stop() {
        service.close();
        return "Simulación detenida.";
    }
}
