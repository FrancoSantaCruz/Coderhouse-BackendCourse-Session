const checkSession = async (req, res, next) => {

    const email = req.session.email
    const first_name = req.session.first_name
    const cart = req.session.cart
    
    if( email && first_name && cart){
        next()
    } else {
        if(req.path !== '/login' && req.path !== '/api/auth/login' && req.path !== '/api/auth/signup' && req.path !== '/signup'){            
            res.redirect('/login')
        } else {
            next()
        }
    }
}

export default checkSession