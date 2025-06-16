export default function adminAuth(req, res, next) {
  //const role = req.headers["x-role"];
  console.log("Admin role from header:", req.headers["x-role"]);
  if (req.headers["x-role"] === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
}