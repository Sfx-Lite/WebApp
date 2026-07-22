/* eslint-disable react/set-state-in-effect */
import type { SubmitHandler } from "react-hook-form";
import type { RegisterFormData } from "../../lib/schemas/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdCancel, MdCheck } from "react-icons/md";
import { Link } from "react-router";
import { toast } from "sonner";
import api from "../../api/axios";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { useCountries } from "../../hooks/useCountries";
import { registerSchema, usernameSchema } from "../../lib/schemas/schema";
import { credentialsSet, pinStatusSet } from "../../store/authSlice";
import CountrySelect from "../Form/CountrySelect";
import FormInput from "../Form/FormInput";
import FormPhoneInput from "../Form/FormPhoneInput";
import SvgSpinners3DotsFade from "../global/icons/SvgSpinners3DotsFade";
import GoogleAuth from "./GoogleAuth";
import { trackEvent } from "@/utils/trackEvent";

const REGISTER_URL = "/auth/register";

type RegisterProps = {
  defaultValues?: Partial<RegisterFormData>;
  onSuccess: (data: RegisterFormData) => void;
  onGoogleSuccess: (isNewUser: boolean) => void;
};

export default function Register({ defaultValues, onSuccess, onGoogleSuccess }: RegisterProps) {
  const dispatch = useAppDispatch();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues,
  });

  const { countries, isLoading: countriesLoading, error: countriesError } = useCountries();

  const countryOptions = useMemo(
    () =>
      countries.map(c => ({
        label: c.name,
        value: c.alpha2Code,
        alpha2Code: c.alpha2Code,
      })),
    [countries],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  const usernameValue = watch("username");

  useEffect(() => {
    const parsed = usernameSchema.safeParse(usernameValue);
    if (!usernameValue || !parsed.success) {
      setIsUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const response = await api.get(`/users/search/${encodeURIComponent(usernameValue)}`);

        setIsUsernameAvailable(response.data.data.available);
      }
      catch (error) {
        console.error("Username check failed", error);
        setIsUsernameAvailable(null);
      }
      finally {
        setCheckingUsername(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      setCheckingUsername(false);
    };
  }, [usernameValue]);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (isUsernameAvailable === false) {
      setError("username", { message: "Username is already taken." });
      return;
    }
    if (isUsernameAvailable === null) {
      setError("username", { message: "Please wait until username availability is checked." });
      return;
    }

    const { confirmPassword, phoneCountryCode, phoneNumber, ...payload } = data;
    // const selectedCountry = countries.find(c => c.alpha2Code === phoneCountryCode);

    // const payload = {
    //   ...rest,
    //   phoneNumber: `${selectedCountry?.callingCode ?? ""}${phoneNumber}`,
    // };

    setIsSubmitting(true);

    try {
      const response = await api.post(REGISTER_URL, payload);
      const { accessToken, refreshToken, user } = response.data?.data ?? {};

      if (accessToken && refreshToken && user) {
        dispatch(credentialsSet({ accessToken, refreshToken, user }));
        dispatch(pinStatusSet(false));
        trackEvent("signup_completed", { method: "email" });
        toast.success("Account created successfully!");
        onSuccess(data);
      }
      else {
        toast.error("Registration succeeded but session data was missing.");
      }
    }
    catch (error) {
      const message = axios.isAxiosError<{ message: string }>(error)
        ? error.response?.data?.message
        : "Something went wrong with registration.";

      toast.error(message ?? "Something went wrong with registration.");
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-[2.25rem]">
        <div>
          <h1 className="text-[1.5rem] mb-1 font-rh-sb">
            Create your SFx account
          </h1>
          <p className="text-[1rem] leading-[1.25rem] text-sfx-muted">
            Create your account in minutes and start
            {" "}
            <br />
            making fast, secure transactions
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-[2.25rem]"
        >
          <div>
            <fieldset disabled={isSubmitting} className="space-y-4">
              <div className="grid grid-col-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  type="text"
                  placeholder="John"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <FormInput
                  label="Last Name"
                  type="text"
                  placeholder="Doe"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Email"
                  type="email"
                  placeholder="Sample@gmail.com"
                  {...register("email")}
                  error={errors.email?.message}
                />
                <div className="space-y-2">
                  <div className="relative">
                    <FormInput
                      label="Username"
                      type="text"
                      placeholder="johndoe"
                      {...register("username", {
                        onChange: (e) => {
                          const cleaned = e.target.value.replace("@", "");
                          if (cleaned !== e.target.value) {
                            setValue("username", cleaned, { shouldValidate: true });
                          }
                        },
                      })}
                      error={errors.username?.message}
                    />
                    <div className="absolute right-3 top-[48px]">
                      {checkingUsername
                        ? (
                            <div className="w-4 h-4 border-2 border-sfx-primary border-t-transparent rounded-full animate-spin" />
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
                  {checkingUsername && (
                    <p className="text-sm text-sfx-muted">Checking username...</p>
                  )}
                  {!checkingUsername && !errors.username && isUsernameAvailable === true && (
                    <p className="text-sm text-green-500">Username is available</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="phoneCountryCode"
                  control={control}
                  render={({ field }) => (
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field: numberField }) => (
                        <FormPhoneInput
                          countryCode={field.value}
                          onCountryChange={field.onChange}
                          value={numberField.value}
                          onChange={numberField.onChange}
                          error={errors.phoneNumber?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CountrySelect
                      label="Country"
                      options={countryOptions}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      placeholder={countriesLoading ? "Loading countries..." : "Select your country"}
                      disabled={countriesLoading}
                      error={errors.country?.message ?? countriesError ?? undefined}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Password"
                  type="password"
                  placeholder="*********"
                  {...register("password")}
                  error={errors.password?.message}
                />
                <FormInput
                  label="Confirm Password"
                  type="password"
                  placeholder="*********"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />
              </div>
            </fieldset>
          </div>

          <div className="space-y-3.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-3 rounded-full flex items-center justify-center bg-sfx-primary text-white font-rh-b hover:scale-95 transition-transform duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (<SvgSpinners3DotsFade className="text-[1.5rem]" />) : "Continue"}
            </button>

            <div className="flex gap-2 items-center">
              <div className="flex-1 h-0.5 bg-sfx-muted/40" />
              <span className="inline-block uppercase text-[14px]">or</span>
              <div className="flex-1 h-0.5 bg-sfx-muted/40" />
            </div>

            <GoogleAuth onSuccess={onGoogleSuccess} />

            <div className="text-center">
              <span className="inline-block">
                Already have an account?
              </span>
              {" "}
              <Link
                to="/"
                className="text-sfx-primary font-rh-sb text-[15px] underline"
              >
                Sign in
              </Link>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
