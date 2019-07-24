import moment from "moment";

export const formatTime = time => {
  if (typeof time === "string") {
    if (isNaN(Number(time))) {
      time = new Date(time);
    } else {
      time = Number(time);
    }
  }
  return moment(time).format("MMM, DD YYYY HH:mm:ss");
};
