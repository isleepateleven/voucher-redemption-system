import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

import "./Auth.css";

const Auth = () => {
  const { showToast } = useToast();
  // const { user } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();

    if (isRegister && password !== confirmPassword) {
      showToast({
        severity: "warn",
        summary: "Password Mismatch",
        detail: "Passwords do not match.",
      });
      return;
    }

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast({
          severity: "success",
          summary: "Account Created",
          detail: "Welcome to VoucherBank!",
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        showToast({
          severity: "success",
          summary: "Login Successful",
          detail: "Welcome back!",
        });
      }
      navigate("/home");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        showToast({
          severity: "warn",
          summary: "Email Exists",
          detail: "Try logging in instead.",
        });
      } else if (err.code === "auth/invalid-email") {
        showToast({
          severity: "error",
          summary: "Invalid Email",
          detail: "Please enter a valid email address.",
        });
      } else if (err.code === "auth/weak-password") {
        showToast({
          severity: "warn",
          summary: "Weak Password",
          detail: "Password should be at least 6 characters.",
        });
      } else if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        showToast({
          severity: "error",
          summary: "Invalid Credentials",
          detail: "Incorrect email or password.",
        });
      } else {
        showToast({
          severity: "error",
          summary: "Authentication Error",
          detail: err.message,
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast({
        severity: "success",
        summary: "Google Sign-In",
        detail: "Welcome!",
      });
      navigate("/home");
    } catch (err) {
      showToast({
        severity: "error",
        summary: "Google Sign-In Failed",
        detail: err.message,
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2 className="auth-title">Welcome to VoucherBank</h2>

        <form onSubmit={handleAuth} className="auth-form">
          <label htmlFor="email">Email</label>
          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="same-input w-full"
            required
          />

          <label htmlFor="password">Password</label>
          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            className="w-full"
            inputClassName="same-input"
            required
          />

          {isRegister && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                toggleMask
                feedback={false}
                className="w-full"
                inputClassName="same-input"
                required
              />
            </>
          )}

          <Button
            label={isRegister ? "Sign Up" : "Log in"}
            type="submit"
            className="auth-submit"
          />
        </form>

        <Divider align="center" className="divider-text">
          Or continue with
        </Divider>

        <Button onClick={handleGoogleSignIn} className="google-btn">
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="google-icon"
          />
          <span>Sign in with Google</span>
        </Button>

        <p className="auth-toggle">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <button
            type="button"
            className="auth-link-btn"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;