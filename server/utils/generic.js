exports.getError = (res, error, code = 500) => res.status(code).json({ error });
