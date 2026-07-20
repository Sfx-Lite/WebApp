import axios from "axios";
import { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import logopurple from "@/assets/imgs/sfx-logo-purple.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GoogleOAuth from "../GoogleAuth/GoogleOAuth";

const LOGIN_URL = "/auth/login";

export default function Login() {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const usernameRegex = /^\w{3,20}$/;
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;

  const isValidIdentifier
    = emailRegex.test(userIdentifier) || usernameRegex.test(userIdentifier);

  const isPasswordValid = password.length >= 8;
  const isUserLoginComplete = isValidIdentifier && isPasswordValid;

  const identifierError
    = userIdentifier && !isValidIdentifier
      ? "Enter a valid email or username."
      : "";

  const passwordError
    = password && !isPasswordValid
      ? "Password must be at least 8 characters."
      : "";

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      toast.success("Logged in with Google successfully!");
      navigate("/pin", { state: { from: "login", token } });
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post(LOGIN_URL, {
        emailOrUsername: userIdentifier,
        password,
      });
      console.warn("Login successful", response.data);

      const token = response.data?.data?.accessToken;
      if (token) {
        toast.success("Logged in successfully!");
        navigate("/pin", { state: { from: "login", token } });
      }
      else {
        console.error(
          "Token missing from server payload structure:",
          response.data,
        );
        toast.error("Authentication token not found in server response.");
      }
    }
    catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Login failed"
        : "Something went wrong with login.";

      toast.error(message);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex p-4 flex-col justify-between h-screen w-full bg-sfx-primary-tint">
      <div className="py-2 mt-4">
        <img src={logopurple} className="w-[120px]" />
      </div>

      <div className="flex-1 pt-10">
        <div className="mb-8">
          <h1 className="text-2xl font-rh-sb text-sfx-ink">Welcome back</h1>

          <p className="text-sm text-sfx-muted mt-1">
            Log in to your SFx Lite Account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label
              className="font-rh-r text-sm text-sfx-muted"
              htmlFor="identifier"
            >
              Email or Username
            </label>

            <Input
              className="
                mt-1
                bg-white
                h-12
                py-4
                rounded-input
                border-[1.5px]
                text-sfx-ink
                placeholder:text-sfx-muted
                focus:outline-none
                focus:ring-2
                focus:ring-sfx-primary-tint
                focus:border-transparent
              "
              id="identifier"
              type="text"
              placeholder="Enter your email or username"
              value={userIdentifier}
              onChange={e => setUserIdentifier(e.target.value)}
              required
            />

            {identifierError && (
              <p className="text-red-500 text-sm mt-1">{identifierError}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              className="font-rh-r text-sm text-sfx-muted"
              htmlFor="password"
            >
              Password
            </label>

            <div className="relative">
              <Input
                className="
                  mt-1
                  bg-white
                  h-12
                  py-4
                  rounded-input
                  border-[1.5px]
                  text-sfx-ink
                  placeholder:text-sfx-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sfx-primary-tint
                  focus:border-transparent
                  "
                id="password"
                autoComplete="off"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={e => setPassword(e.target.value)}
                required
              />

              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-xs
                  text-sfx-primary
                  "
              >
                {showPassword
                  ? (
                      <MdOutlineVisibilityOff size="20px" />
                    )
                  : (
                      <MdOutlineRemoveRedEye size="20px" />
                    )}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-sfx-primary-strong hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isUserLoginComplete}
            className="
              font-rh-sb
              w-full
              h-(--spacing-button-h)
              rounded-button
              bg-sfx-primary
              text-sfx-primary-tint
              hover:bg-sfx-ink hover:text-sfx-primary
              "
          >
            Log In
          </Button>

          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-sfx-muted/30" />

            <span className="absolute bg-sfx-primary-tint px-3 text-xs font-rh-m text-sfx-muted font-rh-sb">
              or
            </span>
          </div>

          <GoogleOAuth />
          <div className="p-2 text-center text-sm text-sfx-muted">
            Don"t have an account?
            {" "}
            <Link
              to="/register"
              className="font-rh-r text-sfx-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
