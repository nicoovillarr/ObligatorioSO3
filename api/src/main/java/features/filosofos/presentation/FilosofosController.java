package features.filosofos.presentation;

import java.util.HashMap;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;

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
        response.put("filosofosCount", service.getFilosofosCount());
        return new Gson().toJson(response);
    }
}
