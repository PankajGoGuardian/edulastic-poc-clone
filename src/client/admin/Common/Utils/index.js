export const getDate = () => {
  const currentDate = new Date();
  const oneYearDate = new Date(new Date().setFullYear(currentDate.getFullYear() + 1));
  return {
    currentDate: currentDate.getTime(),
    oneYearDate: oneYearDate.getTime()
  };
};
