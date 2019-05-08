import { fileApi } from "@edulastic/api";
import { aws } from "@edulastic/constants";

const s3Folders = Object.values(aws.s3Folders);
/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async (file, folder) => {
  if (!file) {
    throw new Error("file is missing");
  }
  if (!folder || !s3Folders.includes(folder)) {
    throw new Error("folder is invalid");
  }

  const result = await fileApi.getSignedUrl(file.name, folder);
  const formData = new FormData();
  const { fields, url } = result;

  Object.keys(fields).forEach(item => {
    formData.append(item, fields[item]);
  });

  formData.append("file", file);

  await fileApi.uploadBySignedUrl(url, formData);
  return `${url}/${fields.key}`;
};
