export const successHandler = (res, message, status = 200) => {
  res.statusCode = status;
  res.send({
    result: message,
  });
};
