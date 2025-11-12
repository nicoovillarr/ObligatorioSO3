package features.filosofos.presentation;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import features.filosofos.application.FilosofosService;
import features.filosofos.data.entities.StartRequest;

@RestController
@RequestMapping("/filosofos")
public class FilosofosController {
    private final FilosofosService service;

    public FilosofosController(FilosofosService service) {
        this.service = service;
    }

    @PostMapping("/iniciar")
    public String start(@RequestBody StartRequest request) {
        service.iniciar(request.getFilosofos());
        return "Simulación iniciada.";
    }

    @PostMapping("/parar")
    public String stop() {
        service.close();
        return "Simulación detenida.";
    }
}
