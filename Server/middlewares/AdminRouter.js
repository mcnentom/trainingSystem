export const adminProtectedRoute = (req, res, next) => {
    // Check if user is an admin (you may have a different way to determine this)
    const isAdmin = req.user && req.user.isAdmin;

    if (!isAdmin) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }

    // If user is admin, proceed to the next middleware
    next();
};

export async function protectedRoute(req,res, next){
    const token  = req.cookies.auth_token;
    if(!token){
       return  res.status(401).send({ status: 'fail', message: 'Invalid token' });
    }
     try {
       console.log("verifying...");
       await verifyToken(token)
       next()
     } catch (error) {
       console.error(error);
       res.status(401).send({ status: 'fail', message: 'Invalid token' });
     }
   }

