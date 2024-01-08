import { useRef, useEffect, useState } from "react";

import { Box, IconButton } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DeleteIcon from "@mui/icons-material/Delete";

import { primaryColor } from "../../style";
import { imageToBlob } from "../../lib/imageToBlob";

type CanvasProps = {
  width: number;
  height: number;
  imageUpload: File;
  setThumbnail: (thumbnail: Blob) => void;
};

const lineWidth = 5;
const rectHeight = 100;
const rectX = lineWidth / 2;
const rectYMin = lineWidth / 2;

export function Canvas(props: CanvasProps) {
  const [isCut, setIsCut] = useState(false);
  const [imageToCut, setImageToCut] = useState<HTMLImageElement | undefined>(
    undefined
  );
  const rectY = useRef(rectYMin);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const rectWidth = props.width - lineWidth;
  const rectYMax = props.height - rectYMin - rectHeight;

  let isRectMoving = false;

  function handleClickCut() {
    setIsCut(isCut ? false : true);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }
    const context = canvas.getContext("2d");
    const cRect = canvas.getBoundingClientRect();
    const image = new Image();

    if (isCut && imageToCut !== undefined) {
      context?.clearRect(0, 0, props.width, props.height);

      if (rectY.current < rectYMin) {
        rectY.current = rectYMin;
      }
      if (rectY.current > rectYMax) {
        rectY.current = rectYMax;
      }

      let ySource =
        (((rectY.current * 100) / props.height) * imageToCut.height) / 100;

      context?.drawImage(
        imageToCut,
        0,
        ySource,
        imageToCut.width,
        imageToCut.height / 4,
        0,
        0,
        rectWidth,
        rectHeight
      );

      const croppedImage = context?.getImageData(0, 0, rectWidth, rectHeight);

      if (croppedImage !== undefined) {
        const blob = imageToBlob(croppedImage);
        props.setThumbnail(blob);
      }
    } else {
      function startMove() {
        isRectMoving = true;
      }

      function stopMove() {
        isRectMoving = false;
      }

      function moveRect(rectYCurrentValue: number) {
        if (isRectMoving) {
          context?.clearRect(0, 0, props.width, props.height);
          context?.drawImage(image, 0, 0, props.width, props.height);

          context?.beginPath();
          if (rectYCurrentValue >= rectYMin && rectYCurrentValue <= rectYMax) {
            context?.rect(rectX, rectYCurrentValue, rectWidth, rectHeight);
          } else if (rectYCurrentValue < rectYMin) {
            context?.rect(rectX, rectYMin, rectWidth, rectHeight);
          } else {
            context?.rect(rectX, rectYMax, rectWidth, rectHeight);
          }
          context!.strokeStyle = primaryColor;
          context?.stroke();
        }
      }

      image.src = URL.createObjectURL(props.imageUpload);
      image.onload = () => {
        context?.drawImage(image, 0, 0, props.width, props.height);
        setImageToCut(image);

        context!.lineWidth = lineWidth;
        context?.beginPath();
        context?.rect(rectX, rectYMin, rectWidth, rectHeight);
        context!.strokeStyle = primaryColor;
        context?.stroke();
      };

      canvas.addEventListener("mousedown", () => {
        startMove();
      });

      canvas.addEventListener("mouseup", () => {
        stopMove();
      });

      canvas.addEventListener("mousemove", (event) => {
        if (cRect !== undefined && isRectMoving) {
          //let canvasX =  Math.round(event.clientX - cRect.left);
          rectY.current = Math.round(event.clientY - cRect.top);
          moveRect(rectY.current);
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
          if (cRect !== undefined && isRectMoving) {
            event.preventDefault(); //Prevents page from scrolling while adjusting rect
            //let canvasX =  Math.round(event.touches[0].clientX - cRect.left);
            rectY.current = Math.round(event.touches[0].clientY - cRect.top);
            moveRect(rectY.current);
          }
        },
        { passive: false }
      );
    }
  }, [props.imageUpload, isCut]);

  return (
    <>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
      <Box display="flex">
        {isCut ? (
          <IconButton color="primary" onClick={handleClickCut}>
            <DeleteIcon />
          </IconButton>
        ) : (
          <IconButton color="primary" onClick={handleClickCut}>
            <ContentCutIcon />
          </IconButton>
        )}
      </Box>
    </>
  );
}
