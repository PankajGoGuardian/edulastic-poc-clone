export const s3ImageBucketPath =
  process.env.REACT_APP_S3_IMAGE_PATH || 'https://edureact-dev.s3.amazonaws.com'

/*
Districts having QTI IMPORT ACCESS
1,2 - POC DISTRICT IDS FOR Barra USD & Corio District
3,4 - PROD DISTRICT IDS FOR Barra USD & Corio District
*/
export const QTI_DISTRICTS = [
  '5e79ae5eda6952de6c21e279',
  '5ebc2adfda6952de6ce9ffb7',
  '5e3d194d03b7ad09241ce6d6',
  '5ebbbb3b03b7ad0924d19c46',
]
