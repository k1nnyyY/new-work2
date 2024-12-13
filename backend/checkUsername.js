const supabase = require("../server");
async function checkUsername(req, res, next) {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .single();
    if (error || !data) {
      return res.status(403).json({ error: "Access denied: invalid username" });
    }
    next();
  } catch (err) {
    console.error("Error in checkUsername:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = checkUsername;
