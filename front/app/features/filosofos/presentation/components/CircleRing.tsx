import { useRef, useEffect } from "react";
import FilosofoState from "../../domain/entities/FilosofoState";

interface MesaProps {
  filosofos: FilosofoState[];
  width: number;
  height: number;
}

export default function Mesa({ filosofos, width, height }: MesaProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    const minDim = Math.min(width, height);
    const ringRadius = minDim / 2 - 32;

    const step = (2 * Math.PI) / filosofos.length;

    for (let i = 0; i < filosofos.length; i++) {
      const filosofo = filosofos[i];

      const angle = i * step;
      const x = centerX + ringRadius * Math.cos(angle);
      const y = centerY + ringRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);

      switch (filosofo) {
        case FilosofoState.PENSANDO:
          ctx.fillStyle = "#C3C3C380";
          break;

        case FilosofoState.COMIENDO:
          ctx.fillStyle = "#2ecc71";
          break;

        case FilosofoState.HAMBRIENTO:
          ctx.fillStyle = "#e74c3c";
          break;

        default:
          throw new Error("Estado de filósofo no manejado");
      }

      ctx.fill();

      ctx.strokeStyle = "#fff";
      ctx.stroke();

      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(filosofo, x, y + 48);
    }
  }, [filosofos, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: "block" }}
    />
  );
}
