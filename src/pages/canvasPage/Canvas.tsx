import { useRef, useEffect } from "react";

import { primaryColor } from "../../style";

type CanvasProps = {
  width: number;
  height: number;
  imageUpload: File;
};

export function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lineWidth = 5;
  const rectHeight = 100;
  const rectWidth = props.width - lineWidth;
  const rectX = lineWidth / 2;
  const rectYMin = lineWidth / 2;
  const rectYMax = props.height - rectYMin - rectHeight;
  let rectY = rectYMin;

  let isRectMoving = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");
    const cRect = canvas.getBoundingClientRect();
    const image = new Image();

    function startMove() {
      isRectMoving = true;
    }

    function stopMove() {
      isRectMoving = false;
    }

    function moveRect(rectY: number) {
      if (isRectMoving) {
        context?.clearRect(0, 0, props.width, props.height);
        context?.drawImage(image, 0, 0, props.width, props.height);

        context?.beginPath();
        if (rectY >= rectYMin && rectY <= rectYMax) {
          context?.rect(rectX, rectY, rectWidth, rectHeight);
        } else if (rectY < rectYMin) {
          context?.rect(rectX, rectYMin, rectWidth, rectHeight);
        } else {
          context?.rect(rectX, rectYMax, rectWidth, rectHeight);
        }
        context!.strokeStyle = primaryColor;
        context?.stroke();
      } else {
        image.onload = () => {
          context?.drawImage(image, 0, 0, props.width, props.height);

          context!.lineWidth = lineWidth;
          context?.beginPath();
          context?.rect(rectX, rectYMin, rectWidth, rectHeight);
          context!.strokeStyle = primaryColor;
          context?.stroke();
        };
      }
    }

    image.src = URL.createObjectURL(props.imageUpload);
    /*image.onload = () => {
      context?.drawImage(image, 0, 0, props.width, props.height);

      context!.lineWidth = lineWidth;
      context?.beginPath();
      context?.rect(rectX, rectYMin, rectWidth, rectHeight);
      context!.strokeStyle = primaryColor;
      context?.stroke();
    };*/

    moveRect(rectYMin);

    canvas.addEventListener("mousedown", () => {
      startMove();
    });

    canvas.addEventListener("mouseup", () => {
      stopMove();
    });

    canvas.addEventListener("mousemove", (event) => {
      if (cRect !== undefined) {
        //let canvasX =  Math.round(event.clientX - cRect.left);
        rectY = Math.round(event.clientY - cRect.top);
        moveRect(rectY);
      }
    });

    canvas.addEventListener(
      "touchstart",
      () => {
        startMove();
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchend",
      () => {
        stopMove();
      },
      { passive: false }
    );

    canvas.addEventListener(
      "touchmove",
      (event) => {
        if (cRect !== undefined) {
          event.preventDefault(); //Prevents page from scrolling while adjusting rect
          //let canvasX =  Math.round(event.touches[0].clientX - cRect.left);
          rectY = Math.round(event.touches[0].clientY - cRect.top);
          moveRect(rectY);
        }
      },
      { passive: false }
    );
  }, [props.imageUpload]);

  return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}
