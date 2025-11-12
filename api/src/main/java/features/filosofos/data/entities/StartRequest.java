package features.filosofos.data.entities;

public class StartRequest {
    private int filosofos;

    public StartRequest() {
    }

    public StartRequest(int filosofos) {
        this.filosofos = filosofos;
    }

    public int getFilosofos() {
        return filosofos;
    }
}