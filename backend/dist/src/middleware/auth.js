import { verifyToken } from "../lib/jwt.js";
export function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "Access token required" });
        return;
    }
    try {
        const payload = verifyToken(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(403).json({ error: "Invalid or expired token" });
        return;
    }
}
//# sourceMappingURL=auth.js.map