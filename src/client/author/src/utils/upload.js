import { fileApi } from "@edulastic/api";
import { aws } from "@edulastic/constants";
import AppConfig from "../../../../../app-config";

const s3Folders = Object.values(aws.s3Folders);
/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async (file, folder, subFolder, progressCallback, cancelUpload) => {
  if (!file) {
    throw new Error("file is missing");
  }
  if ((!folder || !s3Folders.includes(folder)) && !folder.includes("user/")) {
    throw new Error("folder is invalid");
  }

  const result = await fileApi.getSignedUrl(file.name, folder, subFolder);
  const formData = new FormData();
  const { fields, url } = result;

  Object.keys(fields).forEach(item => {
    formData.append(item, fields[item]);
  });

  formData.append("file", file);

  if (!progressCallback) {
    progressCallback = () => {};
  }
  if (!cancelUpload) {
    cancelUpload = () => {};
  }
  await fileApi.uploadBySignedUrl(url, formData, progressCallback, cancelUpload);

  // return CDN url for assets in production
  if (AppConfig.appEnv === "production") {
    return `${AppConfig.cdnURI}/${fields.key}`;
  }
  return `${url}/${fields.key}`;
};
