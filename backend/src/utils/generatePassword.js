function generatePassword(length) {
  let password = '';
  for (let i = 0; i < length; i++) {
    let randNumber = Math.floor(Math.random() * 62);
    let code =
      randNumber < 10
        ? randNumber + 48
        : randNumber < 36
        ? randNumber + 55
        : randNumber + 61;
    password += String.fromCharCode(code);
  }
  return password;
}

export default generatePassword;
