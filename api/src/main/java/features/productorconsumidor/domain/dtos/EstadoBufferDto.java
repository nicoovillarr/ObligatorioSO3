package features.productorconsumidor.domain.dtos;

public class EstadoBufferDto {
  private int size;
  private int capacity;

  public EstadoBufferDto(int size, int capacity) {
    this.size = size;
    this.capacity = capacity;
  }

  public int getSize() {
    return size;
  }

  public int getCapacity() {
    return capacity;
  }
}
