import { useRef, useEffect } from "react";

type CanvasProps = {
  width: number;
  height: number;
  imageUpload: File | null;
};

export function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (context !== null && context !== undefined) {
      if (props.imageUpload !== null) {
        const image = new Image();
        image.src = URL.createObjectURL(props.imageUpload);
        context.clearRect(0, 0, props.width, props.height);
        image.onload = () => {
          context.drawImage(image, 0, 0, props.width, props.height);
        };
      }
    }
  }, [props.imageUpload]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}
