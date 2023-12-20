// get current date in YYYY-MM-DD accounting for timezone via getTimezoneOffset

export const getCurrentDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - offset * 60 * 1000);
  return offsetDate.toISOString().split('T')[0];
};
