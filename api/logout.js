export default function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json({ message: "Logged out successfully" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}