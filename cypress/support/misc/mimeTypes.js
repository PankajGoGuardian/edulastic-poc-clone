function getMimetype(filename) {
  let mimeType = "image/png";
  const fileExtention = filename.split(".").reverse()[0];
  switch (fileExtention) {
    case "png":
      mimeType = "image/png";
      break;

    case "jpeg":
    case "jpg":
      mimeType = "image/jpeg";
      break;

    case "gif":
      mimeType = "image/gif";
      break;

    case "pdf":
      mimeType = "application/pdf";
      break;

    default:
      break;
  }

  return mimeType;
}

export { getMimetype };
