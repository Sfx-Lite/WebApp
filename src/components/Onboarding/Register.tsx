import type { SelectOption } from "@/components/Form/CustomSelect";
import axios from "axios";
import { useEffect, useState } from "react";

import { MdArrowBack, MdCancel, MdCheck } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";

import FormInput from "@/components/Form/CustomInput";
import CustomSelect from "@/components/Form/CustomSelect";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/reduxHooks";

import { registerSchema } from "@/lib/schemas/register-schema";
import { credentialsSet } from "@/store/authSlice";

const REGISTER_URL = "/auth/register";

const COUNTRY_OPTIONS: SelectOption[] = [
  { value: "United States", label: "United States", tag: "US" },
  { value: "United Kingdom", label: "United Kingdom", tag: "GB" },
  { value: "Canada", label: "Canada", tag: "CA" },
  { value: "Australia", label: "Australia", tag: "AU" },
  { value: "Nigeria", label: "Nigeria", tag: "NG" },
  { value: "South Korea", label: "South Korea", tag: "KR" },
  { value: "United Arab Emirates", label: "United Arab Emirates", tag: "AE" },
];

type FieldErrors = Partial<
  Record<"firstName" | "lastName" | "email" | "username" | "country" | "password", string>
>;

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<FieldErrors>({});

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [checkUsername, setCheckUsername] = useState(false);

  const isFirstNameFilled = firstName.trim() !== "";
  const isLastNameFilled = lastName.trim() !== "";
  const isEmailFilled = email.trim() !== "";
  const isUsernameFilled = username.trim() !== "";
  const isCountryFilled = country.trim() !== "";
  const isPasswordFilled = password.trim() !== "";

  const isUserRegisterComplete
    = isFirstNameFilled
      && isLastNameFilled
      && isEmailFilled
      && isUsernameFilled
      && isCountryFilled
      && isPasswordFilled;

  const usernameCheck = async (username: string) => {
    const parsed = registerSchema.shape.username.safeParse(username);
    if (!parsed.success) {
      setIsUsernameAvailable(null);
      return;
    }

    setCheckUsername(true);

    try {
      const response = await api.get(`/users/search/${encodeURIComponent(username)}`);
      setIsUsernameAvailable(response.data.data.available);
    }
    catch (error) {
      console.error("Username check failed", error);
      setIsUsernameAvailable(null);
    }
    finally {
      setCheckUsername(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      usernameCheck(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.replace("@", "");

    const result = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      username: cleanUsername,
      country,
      password,
    });

    const fieldErrors: FieldErrors = {};

    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
    }

    if (isUsernameAvailable === false) {
      fieldErrors.username = "Username is already taken.";
    }
    else if (isUsernameAvailable === null && !fieldErrors.username) {
      fieldErrors.username = "Please wait until username availability is checked.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      if (fieldErrors.country) {
        toast.error(fieldErrors.country);
      }
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await api.post(REGISTER_URL, {
        username: cleanUsername,
        email,
        firstName,
        lastName,
        country,
        password,
      });

      const { accessToken, refreshToken, user } = response.data?.data ?? {};

      if (accessToken && refreshToken && user) {
        dispatch(credentialsSet({ accessToken, refreshToken, user }));
        toast.success("Account created successfully!");
        navigate("/pin", { state: { from: "register" } });
      }
      else {
        toast.error("Registration succeeded but session data was missing.");
      }

      console.warn("User Registered Successfully", response.data);

      toast.success("Account created successfully!");
      navigate("/pin", { state: { from: "register" } });
    }
    catch (error) {
      const message = axios.isAxiosError<{ message: string }>(error)
        ? error.response?.data?.message
        : "Something went wrong with registration.";

      toast.error(message ?? "Something went wrong with registration.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex p-4 flex-col justify-between h-screen w-full bg-sfx-primary-tint">

      <div className="flex-1 ">

        <div className="py-4 mt-6">
          <div className="flex items-center gap-2">
            <Link to="/welcome" className="text-sfx-muted hover:text-sfx-ink">
              <MdArrowBack className="size-6" />
            </Link>

            <h1 className="font-rh-sb text-xl">Create account</h1>
          </div>
        </div>
        {/* Progress Bar */}

        <div className="w-80 mx-auto">
          <div className="flex gap-1.5">
            {[
              { name: "firstName", filled: isFirstNameFilled },
              { name: "lastName", filled: isLastNameFilled },
              { name: "email", filled: isEmailFilled },
              { name: "username", filled: isUsernameFilled },
              { name: "country", filled: isCountryFilled },
              { name: "password", filled: isPasswordFilled },
            ].map(item => (
              <div
                key={item.name}
                className={`
          h-1.5
          flex-1
          rounded-full
          transition-all
          duration-300
          ${
              item.filled
                ? "bg-sfx-primary shadow-brand"
                : "bg-sfx-muted/40"
              }
        `}
              />
            ))}
          </div>
        </div>

        {/* Form */}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* First Name */}
          <div className="mt-4">
            <FormInput
              label="First name"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={setFirstName}
              required
              error={errors.firstName}
            />
          </div>

          {/* Last Name */}
          <FormInput
            label="Last name"
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={setLastName}
            required
            error={errors.lastName}
          />

          {/* Email */}
          <FormInput
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(value) => {
              setEmail(value);
              setErrors(prev => ({ ...prev, email: undefined }));
            }}
            required
            error={errors.email}
          />

          {/* Username */}

          <div className="space-y-2">
            <div className="relative">
              <FormInput
                label="Username"
                type="text"
                autoComplete="off"
                placeholder="Pick a username"
                value={username}
                onChange={(value) => {
                  const cleaned = value.replace("@", "").trim();
                  setErrors(prev => ({ ...prev, username: undefined }));
                  setIsUsernameAvailable(null);
                  setUsername(cleaned);
                }}
                required
                error={errors.username}
              />

              {/* Username status icon */}
              <div className="absolute right-3 top-[42px]">
                {checkUsername
                  ? (
                      <div
                        className="
                        w-4
                        h-4
                        border-2
                        border-sfx-primary
                        border-t-transparent
                        rounded-full
                        animate-spin
                        "
                      />
                    )
                  : isUsernameAvailable === true
                    ? (
                        <MdCheck size={22} className="text-green-500" />
                      )
                    : isUsernameAvailable === false
                      ? (
                          <MdCancel size={22} className="text-red-500" />
                        )
                      : null}
              </div>
            </div>

            {checkUsername && (
              <p className="text-sm text-sfx-muted">Checking username...</p>
            )}

            {!checkUsername && !errors.username && isUsernameAvailable === true && (
              <p className="text-sm text-green-500">Username is available</p>
            )}
          </div>

          {/* Country */}

          <CustomSelect
            label="Home Country"
            placeholder="Select your country"
            options={COUNTRY_OPTIONS}
            value={country}
            onChange={(value) => {
              setCountry(value);
              setErrors(prev => ({ ...prev, country: undefined }));
            }}
            error={errors.country}
          />

          {/* Password */}

          <FormInput
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setErrors(prev => ({ ...prev, password: undefined }));
            }}
            required
            error={errors.password}
          />

          {/* Button */}

          <Button
            type="submit"
            disabled={isLoading || !isUserRegisterComplete}
            className="
              w-full
              h-(--spacing-button-h)
              rounded-button
              bg-sfx-primary
              text-sfx-primary-tint
              hover:bg-sfx-ink
              hover:text-sfx-primary
            "
          >
            {isLoading ? "Creating account..." : "Continue"}
          </Button>

          <div
            className="
            p-2
            text-center
            text-sm
            text-sfx-muted
          "
          >
            Do you have an account?
            {" "}
            <Link
              to="/login"
              className="
                text-sfx-primary
                hover:underline
              "
            >
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
