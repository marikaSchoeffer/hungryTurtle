export function imageToBlob(croppedImage: ImageData) {
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = croppedImage?.width;
  croppedCanvas.height = croppedImage?.height;
  const contextCroppedCanvas = croppedCanvas.getContext("2d");

  contextCroppedCanvas?.putImageData(croppedImage, 0, 0);
  const dataURL = croppedCanvas.toDataURL();
  const parts = dataURL.split(";base64,");
  const imageType = parts[0].split(":")[1];
  const decodedData = window.atob(parts[1]);
  const unit8Array = new Uint8Array(decodedData.length);

  for (let i = 0; i < decodedData.length; ++i) {
    unit8Array[i] = decodedData.charCodeAt(i);
  }
  const blob = new Blob([unit8Array], { type: imageType });
  return blob;
}
