export const getFinancialYear = (date) => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
};

export const getFYDateRange = (financialYear) => {
  const [startYear, endYear] = financialYear.split("-").map(Number);

  const startDate = new Date(startYear, 3, 1);
  const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999);

  return { startDate, endDate };
};
