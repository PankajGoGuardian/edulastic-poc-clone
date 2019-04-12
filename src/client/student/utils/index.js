import moment from "moment";

export const formatTime = time => {
  if (typeof time === "string") {
    if (isNaN(Number(time))) {
      time = new Date(time);
    } else {
      time = Number(time);
    }
  }
  return moment(time)
    .local()
    .format("MMM, DD YYYY hh:mm A");
};
