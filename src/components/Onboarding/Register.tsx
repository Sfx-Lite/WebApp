import axios from "axios";

import { useEffect, useState } from "react";
import {
  MdArrowBack,
  MdCancel,
  MdCheck,
  MdOutlineRemoveRedEye,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";

import { toast } from "sonner";
import api from "@/api/axios";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const USER_REGEX = /^[a-z][\w-]{3,23}$/i;

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%]).{8,24}$/;

const REGISTER_URL = "/auth/register";
const CHECK_USERNAME_URL = "users/search/{username}";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [checkUsername, setCheckUsername] = useState(false);

  const isFirstNameFilled = firstName.trim() !== "";
  const isLastNameFilled = lastName.trim() !== "";
  const isUsernameFilled = username.trim() !== "";
  const isCountryFilled = country.trim() !== "";
  const isPasswordFilled = password.trim() !== "";

  const isUserRegisterComplete
    = isFirstNameFilled
      && isLastNameFilled
      && isUsernameFilled
      && isCountryFilled
      && isPasswordFilled;

  const usernameCheck = async (username: string) => {
    if (!USER_REGEX.test(username)) {
      setIsUsernameAvailable(null);
      return;
    }

    setCheckUsername(true);

    try {
      const response = await api.get(CHECK_USERNAME_URL, {
        params: {
          username,
        },
      });

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

  const handleRegister = async (e: any) => {
    e.preventDefault();

    setUsernameError("");
    setPasswordError("");

    let isUserValid = true;

    const cleanUsername = username.replace("@", "");

    if (!country) {
      toast.error("Please select your country.");
      isUserValid = false;
    }
    if (!USER_REGEX.test(cleanUsername)) {
      setUsernameError(
        "Username must be 4-24 characters, start with a letter, and contain only letters, numbers, '-' or '_'.",
      );

      isUserValid = false;
    }

    if (isUsernameAvailable === false) {
      setUsernameError("Username is already taken.");

      isUserValid = false;
    }

    if (isUsernameAvailable === null) {
      setUsernameError("Please wait until username availability is checked.");

      isUserValid = false;
    }

    if (!PWD_REGEX.test(password)) {
      setPasswordError(
        "Password must be 8-24 characters and include uppercase, lowercase, number and special character (!@#$%).",
      );

      isUserValid = false;
    }

    if (!isUserValid) {
      return;
    }
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

      console.warn("User Registered Successfully", response.data);

      toast.success("Account created successfully!");
      navigate("/pin");
    }
    catch (error) {
      const message = axios.isAxiosError<{ message: string }>(error)
        ? error.response?.data?.message
        : "Something went wrong with registration.";

      toast.error(message);
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
          <div className="space-y-2 mt-4">
            <label
              htmlFor="firstname"
              className="font-rh-r font-medium text-sfx-muted"
            >
              First name
            </label>

            <Input
              id="firstname"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
              "
            />
          </div>

          {/* Last Name */}

          <div className="space-y-2">
            <label
              htmlFor="lastname"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Last name
            </label>

            <Input
              id="lastname"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
              "
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Email
            </label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
              "
            />
          </div>

          {/* Username */}

          <div className="space-y-2">
            <label
              htmlFor="username"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Username
            </label>

            <div className="relative">
              <Input
                id="username"
                type="text"
                autoComplete="off"
                placeholder="Pick a username"
                value={username}
                onChange={(e) => {
                  const value = e.target.value.replace("@", "").trim();

                  setUsernameError("");
                  setIsUsernameAvailable(null);

                  setUsername(value);
                }}
                required

                className={`
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
                pr-10

                ${usernameError || isUsernameAvailable === false ? "border-red-500" : ""}

                ${isUsernameAvailable === true ? "border-green-500" : ""}

              `}
              />

              {/* Username status icon */}

              <div
                className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                "
              >
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

            {!checkUsername && isUsernameAvailable === true && (
              <p className="text-sm text-green-500">Username is available</p>
            )}

            {!checkUsername && isUsernameAvailable === false && (
              <p className="text-sm text-red-500">Username is already taken</p>
            )}
          </div>

          {/* Country */}

          <div className="space-y-2">
            <label
              htmlFor="country"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Home Country
            </label>

            <Select
              value={country}
              onValueChange={(value) => {
                if (value !== null) {
                  setCountry(value);
                }
              }}
            >
              <SelectTrigger
                id="country"
                className="
                  w-full
                  h-12
                  rounded-input
                  bg-white
                  text-sfx-ink
                "
              >
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-sfx-primary-tint text-sfx-ink">
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
                <SelectItem value="South Korea">South Korea</SelectItem>
                <SelectItem value="United Arab Emirates">
                  United Arab Emirates
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Password
            </label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter your password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                className={`
                  h-12
                  rounded-input
                  bg-white
                  text-sfx-ink
                  pr-10
                  ${passwordError ? "border-red-500" : ""}
                `}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-sfx-primary
                "
              >
                {showPassword
                  ? (
                      <MdOutlineVisibilityOff size={20} />
                    )
                  : (
                      <MdOutlineRemoveRedEye size={20} />
                    )}
              </button>
            </div>

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
          </div>

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
