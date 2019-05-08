import { fileApi } from "@edulastic/api";

/**
 * upload a file to s3 using signed url
 * @param {file} file
 */
export const uploadToS3 = async file => {
  const result = await fileApi.getSignedUrl(file.name);
  const formData = new FormData();
  const { fields, url } = result;

  Object.keys(fields).forEach(item => {
    formData.append(item, fields[item]);
  });

  formData.append("file", file);

  await fileApi.uploadBySignedUrl(url, formData);
  return `${url}/${fields.key}`;
};
