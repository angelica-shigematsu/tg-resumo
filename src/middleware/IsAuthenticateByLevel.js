module.exports = {  
  isAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.level=== "Administrador") {
        next();
      }
      res.redirect('/login')
  	}
  res.redirect("/login");
},
isUser: (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.level=== "Usuario") {
      next();
    }
    res.redirect('/login')
  }
res.redirect("/login");
},
  //Admin has acess what volunteer has
  isAllLevel: (req, res, next) => {
    try {
      const allLevelUsers = req.user.level === "Voluntario" || req.user.level === 'Usuario'|| req.user.level === "Administrador"
    if(req.isAuthenticated()) {
      if(allLevelUsers) {
        next();
      }
			res.redirect('/login')
    }
    }catch(error) {
      res.redirect('/login')
    }
  }
}
