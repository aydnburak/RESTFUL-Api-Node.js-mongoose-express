
const admin = (req, res, next) => {
    
    if (req.user && !req.user.isAdmin) {
        return res.status(403).json({
            mesaj:'Erişim engellendi sen admin değilsin'
        });
    }
    next();


};

module.exports = admin;