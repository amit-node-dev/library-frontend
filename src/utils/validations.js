export const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return "Invalid email address";
    }
    return "";
  };
  
  export const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Must contain at least one special character";
    return "";
  };
  
  export const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required";
    if (!/^[0-9]{10}$/.test(mobile)) return "Invalid mobile number";
    return "";
  };