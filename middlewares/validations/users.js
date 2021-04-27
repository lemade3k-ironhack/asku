
/* Custom Middleware: Validate user input */
const validateSignin = (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render("users/signin.hbs", { 
      username, password, msg: "Please fill all the fields!" 
    });
  }
  next();
};

/* Custom Middleware: Validate user input */
const validateSignup = (req, res, next) => {
  const { username, password, passwordConfirmation } = req.body;
  const pwReg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

  const renderFormWithError = (err) => {
    res.render("users/signup.hbs", {
      username, password, passwordConfirmation, msg: err,
    });
  };

  if (!username || !password || !passwordConfirmation) {
    renderFormWithError("Please fill all the fields!" );
  } else if (!pwReg.test(String(password))) {
    renderFormWithError(
      "Password must have at least 8 characters, contain a number, upper and lower letters"
    );
  } else if (!(password === passwordConfirmation)) {
    renderFormWithError(
      "Password and Password Confirmation do not match. Please try again"
    );
  } else {
    next();
  }
};

module.exports = { validateSignin, validateSignup }