package features.productorconsumidor.presentation;

import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

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

    @PostMapping("/reiniciar")
    public String restart() {
        service.reiniciar();
        return "Simulación reiniciada.";
    }

    @GetMapping("/estado")
    public String estado() {
        HashMap<String, Object> response = new HashMap<>();
        response.put("isRunning", service.estado());
        response.put("productoresCount", service.getProductoresCount());
        response.put("consumidoresCount", service.getConsumidoresCount());
        response.put("bufferSize", service.getBufferSize());
        response.put("bufferCapacity", service.getBufferCapacity());
        return new Gson().toJson(response);
    }
}
