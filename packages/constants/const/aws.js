module.exports = {
  s3Folders: {
    DOCS: 'doc_based',
    COURSE: 'course',
    DEFAULT: 'default',
    BUBBLE_SHEETS: 'bubble_answer_sheets',
    USER: 'user',
    QTI_IMPORT: 'qtiImports',
    WEBCT_IMPORT: 'webctImports',
    PO_SUBMISSIONS: 'poSubmissions',
    WEBCAM_OMR_UPLOADS: 'webcam_omr_uploads',
    DATA_WAREHOUSE_FOLDER:
      process.env.REACT_APP_AWS_S3_DATA_WAREHOUSE_FOLDER ||
      'dev_data_warehouse',
  },
}
