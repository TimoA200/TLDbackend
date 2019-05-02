const reCAPTCHA = require('recaptcha2');

const CAPTCHA = () => {

  this.Captcha = new reCAPTCHA({
    siteKey: '6LfD7n0UAAAAAOjrMobnIgP-0FqbRwIbdGpXVAX_', // retrieved during setup
    secretKey: '6LfD7n0UAAAAAM1QOzKBNWfOhEi0dxkVq2vzUX7_', // retrieved during setup
    ssl: true
  });;

  this.getCaptcha = () => {
    return this.Captcha;
  }

  this.isValid = (captcha) => {
    return new Promise((resolve, reject) => {
      getCaptcha().validate(captcha).then(() => resolve(true)).catch(() => resolve(false))
    });
  }
  return this;
}

module.exports = CAPTCHA();
