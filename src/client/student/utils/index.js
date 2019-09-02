import moment from "moment";

export const normaliseTime = time => {
  let copiedTime = time;
  if (typeof copiedTime === "string") {
    if (isNaN(Number(copiedTime))) {
      copiedTime = new Date(copiedTime);
    } else {
      copiedTime = Number(copiedTime);
    }
  }

  return copiedTime;
};

export const formatTime = time => {
  return moment(normaliseTime(time)).format("MMM, DD YYYY HH:mm:ss");
};

export const formatDateAndTime = time => {
  return moment(normaliseTime(time)).format("MMM DD, HH:mm A");
};
