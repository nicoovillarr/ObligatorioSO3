package features.productorconsumidor;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import features.productorconsumidor.application.ProductorConsumidorService;

public class Main {
    private static final int CAPACIDAD_BUFFER = 5;
    private static final int NUM_PRODUCTORES = 2;
    private static final int NUM_CONSUMIDORES = 3;
        
    public static void main(String[] args) {
        try (var context = new AnnotationConfigApplicationContext()) {
            context.scan("features.productorconsumidor");
            context.refresh();

            try (features.productorconsumidor.application.ProductorConsumidorService service = context.getBean(ProductorConsumidorService.class)) {
                service.iniciar(CAPACIDAD_BUFFER, NUM_PRODUCTORES, NUM_CONSUMIDORES);
                Thread.sleep(20000);
            }

            System.out.println("ProductorConsumidor finalizado.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
