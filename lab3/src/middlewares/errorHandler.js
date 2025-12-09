export function errorHandler(err, req, res, next) {
  console.error("ERR:", err);
  res.status(400).json({
    success: false,
    message: err.message || "Server error",
  });
}