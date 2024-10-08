import React, { useState } from 'react';
import './SignupForm.css'; // Assurez-vous de créer ce fichier CSS

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showStrengthBar, setShowStrengthBar] = useState(false); // État pour afficher la barre de force
  const [notification, setNotification] = useState(''); // État pour la notification

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({ ...prev, email: 'Email non valide' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '' }));
      }
    }

    if (name === 'password') {
      const strength = validatePassword(value);
      setPasswordStrength(strength);

      if (strength < 3) {
        setErrors((prev) => ({
          ...prev,
          password: '',
        }));
      } else {
        setErrors((prev) => ({ ...prev, password: '' }));
      }

      if (formData.confirmPassword && value !== formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Les mots de passe doivent correspondre',
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: 'Les mots de passe doivent correspondre',
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      setNotification('Une erreur est survenue');
    } else {
      setNotification('Compte créé avec succès');
      // Réinitialiser les données du formulaire après la soumission réussie
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
      setPasswordStrength(0); // Réinitialiser la force du mot de passe si nécessaire
      setShowStrengthBar(false); // Masquer la barre de force après la soumission

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification('');
      }, 3000);
    }
  };

  const getStrengthBarColor = () => {
    if (passwordStrength === 3) return 'green';
    if (passwordStrength === 2) return 'orange';
    return 'red';
  };

  return (
    <div>
      {notification && <div className="notification">{notification}</div>} {/* Notification ici */}
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>
        <div className="input-group">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input
            type="text"
            name="firstName"
            placeholder="Nom"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input
            type="text"
            name="lastName"
            placeholder="Prénom"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <i className="fa fa-envelope" aria-hidden="true"></i>
          <input
            type="email"
            name="email"
            placeholder="Mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="input-group">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onFocus={() => setShowStrengthBar(true)} // Affiche la barre au focus
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} aria-hidden="true"></i>
          </span>
          {showStrengthBar && ( // Affiche la barre uniquement si l'input est cliqué
            <div className="password-strength" style={{ backgroundColor: getStrengthBarColor() }}>
              <div className="strength-bar" style={{ width: `${passwordStrength * 33.33}%` }} />
            </div>
          )}
        </div>
        <div className="input-group">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirmation du mot de passe"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} aria-hidden="true"></i>
          </span>
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit">
          <i className="fas fa-sign-in-alt"></i> Login
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
