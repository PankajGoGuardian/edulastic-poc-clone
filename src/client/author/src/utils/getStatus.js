export const getStatus = status => {
  if (status === "inreview") {
    return "in review";
  }
  return status;
};
