import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword, // Firebase register
  signInWithEmailAndPassword,     // Firebase login
  signInWithPopup,                // Google login
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useToast } from "../context/ToastContext";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const Auth = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  // toggle between login mode and register mode 
  const [isRegister, setIsRegister] = useState(false);

  // form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // show Firebase auth errors 
  const showAuthError = (err) => {
    if (err.code === "auth/email-already-in-use") {
      showToast({
        severity: "warn",
        summary: "Email Exists",
        detail: "Try logging in instead.",
      });
      return;
    }

    if (err.code === "auth/invalid-email") {
      showToast({
        severity: "error",
        summary: "Invalid Email",
        detail: "Please enter a valid email address.",
      });
      return;
    }

    if (err.code === "auth/weak-password") {
      showToast({
        severity: "warn",
        summary: "Weak Password",
        detail: "Password should be at least 6 characters.",
      });
      return;
    }

    if (
      err.code === "auth/user-not-found" ||
      err.code === "auth/wrong-password" ||
      err.code === "auth/invalid-credential"
    ) {
      showToast({
        severity: "error",
        summary: "Invalid Credentials",
        detail: "Incorrect email or password.",
      });
      return;
    }

    showToast({
      severity: "error",
      summary: "Authentication Error",
      detail: err.message,
    });
  };


  // EMAIL AND PASSWORD LOGIN/REGISTER FLOW
  const handleAuth = async (e) => {
    e.preventDefault();

    // register flow
    if (isRegister) {
      // check confirm password only in register mode
      if (password !== confirmPassword) {
        showToast({
          severity: "warn",
          summary: "Password Mismatch",
          detail: "Passwords do not match.",
        });
        return;
      }

      try {
        // create new Firebase account
        await createUserWithEmailAndPassword(auth, email, password);

        showToast({
          severity: "success",
          summary: "Account Created",
          detail: "Welcome to VoucherBank!",
        });

        navigate("/home");
      } catch (err) {
        showAuthError(err);
      }

      return;
    }

    // login flow
    try {
      // sign in existing Firebase user
      await signInWithEmailAndPassword(auth, email, password);

      showToast({
        severity: "success",
        summary: "Login Successful",
        detail: "Welcome back!",
      });

      navigate("/home");
    } catch (err) {
      showAuthError(err);
    }
  };


   // GOOGLE SIGN IN FLOW 
  const handleGoogleSignIn = async () => {
    try {
      // sign in with Google popup
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
    <div className="relative -top-[30px] flex min-h-screen items-center justify-center bg-[#f9f9fb] p-8 font-sans">
      <div className="w-full max-w-[400px] rounded-[10px] bg-[#f9f9fb] p-8 text-center">
        <h2 className="mb-8 text-[1.71rem] font-bold text-[#111]">
          Welcome to VoucherBank
        </h2>

        <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left">
          <label htmlFor="email" className="text-[0.9rem] font-medium text-[#333]">
            Email
          </label>

          <InputText
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="box-border w-full p-[0.6rem] text-[0.9rem]"
            required
          />

          <label htmlFor="password" className="text-[0.9rem] font-medium text-[#333]">
            Password
          </label>

          <Password
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            toggleMask
            feedback={false}
            className="block w-full"
            inputClassName="box-border w-full p-[0.6rem] text-[0.9rem]"
            required
          />

          {isRegister && (
            <>
              <label
                htmlFor="confirmPassword"
                className="text-[0.9rem] font-medium text-[#333]"
              >
                Confirm Password
              </label>

              <Password
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                toggleMask
                feedback={false}
                className="block w-full"
                inputClassName="box-border w-full p-[0.6rem] text-[0.9rem]"
                required
              />
            </>
          )}

          <Button
            label={isRegister ? "Sign Up" : "Log in"}
            type="submit"
            className="mt-2 w-full border-none bg-[#5e4596] p-[0.65rem] text-[0.9rem] font-medium text-white"
          />
        </form>

        <Divider align="center" className="my-[1.2rem] border-none bg-transparent p-0 text-xs text-[#888]">
          Or continue with
        </Divider>

        <Button
          onClick={handleGoogleSignIn}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded border border-[#dadce0] bg-white px-4 py-[0.6rem] text-[0.9rem] font-medium text-black shadow-sm transition-colors hover:bg-[#f7f8f8]"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="h-[18px] w-[18px]"
          />
          <span>Sign in with Google</span>
        </Button>

        <p className="text-center text-xs text-[#888]">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="m-0 cursor-pointer border-none bg-transparent p-0 text-[0.8rem] font-medium text-[#665290] underline hover:text-[#9986d0]"
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