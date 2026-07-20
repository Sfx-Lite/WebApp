import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import logopurple from "@/assets/imgs/sfx-logo-purple.png";
import FormInput from "@/components/Form/CustomInput";
import { Button } from "@/components/ui/button";

import { useAppDispatch } from "@/hooks/reduxHooks";
import { loginSchema } from "@/lib/schemas/login-schema";

import { credentialsSet } from "@/store/authSlice";
import GoogleOAuth from "../GoogleAuth/GoogleOAuth";

const LOGIN_URL = "/auth/login";

type FieldErrors = Partial<Record<"identifier" | "password", string>>;

export default function Login() {
  const [userIdentifier, setUserIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isUserLoginComplete
    = userIdentifier.trim() !== "" && password.trim() !== "";

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      toast.success("Logged in with Google successfully!");
      navigate("/pin", { state: { from: "login", token } });
    }
  }, [searchParams, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      identifier: userIdentifier,
      password,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await api.post(LOGIN_URL, {
        emailOrUsername: result.data.identifier,
        password: result.data.password,
      });

      const { accessToken, refreshToken, user } = response.data?.data ?? {};

      if (accessToken && refreshToken && user) {
        dispatch(credentialsSet({ accessToken, refreshToken, user }));
        toast.success("Logged in successfully!");
        navigate("/pin", { state: { from: "login" } });
      }
      else {
        toast.error("Authentication data not found in server response.");
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
          <FormInput
            label="Email or Username"
            type="text"
            placeholder="Enter your email or username"
            value={userIdentifier}
            onChange={(value) => {
              setUserIdentifier(value);
              setErrors(prev => ({ ...prev, identifier: undefined }));
            }}
            required
            error={errors.identifier}
          />

          <div className="space-y-2">
            <FormInput
              label="Password"
              type="password"
              autoComplete="off"
              placeholder="Enter your password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setErrors(prev => ({ ...prev, password: undefined }));
              }}
              required
              error={errors.password}
            />

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
            Don&apos;t have an account?
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
