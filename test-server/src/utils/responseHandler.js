import curry from 'lodash.curry';

export const errorHandler = curry((res, status = 400, error) => {
  // res.setStatus(status);
  console.log('status', status);
  console.log('error', error);
  res.send('error' + error);
});
