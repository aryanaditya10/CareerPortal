/**
 * Middleware to restrict access to specific roles.
 * Must be used AFTER authUser middleware (which sets req.role).
 * 
 * Usage: authorizeRole("recruiter")  or  authorizeRole("student", "recruiter")
 */
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.role || !roles.includes(req.role)) {
            return res.status(403).json({
                message: `Access denied. Required role: ${roles.join(" or ")}`,
                success: false,
            });
        }
        next();
    };
};

export default authorizeRole;
