package features.filosofos;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import features.filosofos.application.FilosofosService;

public class Main {
    private static final int NUM_FILOSOFOS = 5;

    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext()) {
            context.scan("features.filosofos");
            context.refresh();

            try (features.filosofos.application.FilosofosService service = context.getBean(FilosofosService.class)) {
                service.iniciar(NUM_FILOSOFOS);
                Thread.sleep(20000);
            }

            System.out.println("Filósofos finalizado.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
