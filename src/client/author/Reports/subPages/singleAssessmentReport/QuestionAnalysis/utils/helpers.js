export const getFormattedTimeInMins = secs => {
  const totalMins = Math.floor(secs / 60000);
  const totalSecs = Math.floor((secs - totalMins * 60000) / 1000);
  const avgTimeMins = `${totalMins < 10 ? "0" : ""}${totalMins}:${totalSecs < 10 ? "0" : ""}${totalSecs}`;
  return avgTimeMins;
};
