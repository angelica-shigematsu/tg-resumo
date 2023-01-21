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
  //Admin has acess what volunteer has
  isVolunteerAndAdmin: (req, res, next) => {
    if(req.isAuthenticated()) {
      if(req.user.level === "Voluntario" || req.user.level === "Administrador") {
        next();
      }
			res.redirect('/login')
    }
		res.redirect('/login')
  }
}
