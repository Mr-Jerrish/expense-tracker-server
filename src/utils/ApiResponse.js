export const sendSuccessResponse = (
  res,
  { key = "data", data = {}, message = "Success", statusCode = 200 } = {},
) => {
  return res.status(statusCode).json({
    statusFlag: "Ok",
    status: true,
    paramObjectsMap: {
      [key]: data,
      message,
    },
  });
};

export const sendErrorResponse = (
  res,
  { message = "Something went wrong", statusCode = 500 } = {},
) => {
  return res.status(statusCode).json({
    statusFlag: "Error",
    status: false,
    paramObjectsMap: {
      message,
    },
  });
};
