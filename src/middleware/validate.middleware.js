export const validate = (schema) => (req, res, next) => {
  try {
    const validatedData = schema.parse({
      body: req.body,
    });

    req.validated = validatedData;
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err?.errors?.[0]?.message || "Validation error",
    });
  }
};
