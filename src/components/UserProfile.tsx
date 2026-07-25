import { useEffect, useState } from "react";
import { MdArrowBack, MdEdit, MdOutlinePerson, MdSave } from "react-icons/md";
import { Link } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type InfoFieldProps = {
  label: string;
  value: string;
  disabled?: boolean;

};

type Address = {
  street1: string;
  street2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type UserProfileData = {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  mobileNumber: string;
  email: string;
  tier: string;
  homeCountry: string;
  address: Address;
};

const USER_PROFILE_URL = "/users/profile";

function InfoField({ label, value, disabled }: InfoFieldProps) {
  return (
    <div>
      <label className="mb-2 block font-rh-sb text-sm text-sfx-muted">
        {label}
      </label>

      <div className={`rounded-xl border px-4 py-3 font-rh-sb text-sfx-ink ${
        disabled
          ? "border-sfx-ink/10 bg-sfx-primary-tint/10"
          : "border-sfx-ink/20 bg-sfx-primary-tint/20"
      }`}
      >
        <span className="font-rh-sb text-sfx-ink">
          {value || "—"}
        </span>
      </div>
      {disabled && (
        <p className="mt-1 text-xs text-sfx-muted">
          This field cannot be changed.
        </p>
      )}
    </div>
  );
}

type EditableFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};
function EditableField({
  label,
  value,
  onChange,
}: EditableFieldProps) {
  return (
    <div>
      <label className="mb-2 block font-rh-sb text-sm text-sfx-muted">
        {label}
      </label>

      <input
        value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-sfx-ink/20 bg-sfx-primary-tint px-4 py-3 font-rh-sb text-sfx-ink outline-none focus:border-sfx-primary"
      />
    </div>
  );
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setIsLoading(true);

        const res = await api.get(USER_PROFILE_URL);

        const data = res.data.data;

        setProfile({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          username: data.username || "",
          mobileNumber: data.mobileNumber || "",
          tier: data.tier || "",
          homeCountry: data.homeCountry || "",

          address: {
            street1: data.streetAddress1 || data.address?.street1 || "",
            street2: data.streetAddress2 || data.address?.street2 || "",
            city: data.city || data.address?.city || "",
            state: data.state || data.address?.state || "",
            postalCode: data.postalCode || data.address?.postalCode || "",
            country: data.country || data.address?.country || "",
          },
        });
      }
      catch (err) {
        const message
          = err instanceof Error
            ? err.message
            : "Something went wrong";

        setError(message);
        toast.error(message);
      }
      finally {
        setIsLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const updateField = (field: keyof UserProfileData, value: string) => {
    if (!profile)
      return;
    setProfile(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateAddressField = (field: keyof Address, value: string) => {
    if (!profile)
      return;
    setProfile(prev =>
      prev
        ? {
            ...prev,
            address: {
              ...prev.address,
              [field]: value,
            },
          }
        : prev,
    );
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!profile)
      return;

    try {
      setIsSaving(true);

      const payload = {
        firstName: profile.firstName,
        middleName: profile.middleName,
        lastName: profile.lastName,
        streetAddress1: profile.address.street1,
        streetAddress2: profile.address.street2,
        city: profile.address.city,
        state: profile.address.state,
        country: profile.address.country,
      };

      await api.patch(USER_PROFILE_URL, payload);

      const updatedProfile = await api.get(USER_PROFILE_URL);

      const data = updatedProfile.data.data;

      setProfile({
        firstName: data.firstName || "",
        middleName: data.middleName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        username: data.username || "",
        mobileNumber: data.mobileNumber || "",
        tier: data.tier || "",
        homeCountry: data.homeCountry || "",

        address: {
          street1: data.streetAddress1 || "",
          street2: data.streetAddress2 || "",
          city: data.city || "",
          state: data.state || "",
          postalCode: data.postalCode || "",
          country: data.country || "",
        },
      });

      setIsEditing(false);

      toast.success("Profile updated successfully");
    }
    catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Update failed",
      );
    }
    finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-sfx-primary-tint">
        <p className="font-rh-sb text-sfx-ink"><Spinner /></p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-sfx-primary-tint">
        <p className="font-rh-sb text-red-500">{error || "User profile not found."}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col bg-sfx-primary-tint overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl lg:max-w-5xl flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <header className="mb-8 flex items-center gap-2">
          <Link
            to="/settings"
            className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
          >
            <MdArrowBack className="size-6 text-sfx-ink" />
          </Link>

          <h1 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">
            My Profile
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <section className="rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand h-fit">
            <div className="flex flex-col items-center text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-sfx-primary/10">
                <MdOutlinePerson className="size-10 text-sfx-primary" />
              </div>

              <h2 className="mt-4 font-rh-b text-xl text-sfx-ink">
                {profile.firstName}
                {" "}
                {profile.lastName}
              </h2>

              <p className="mt-1 text-sm text-sfx-muted">
                @
                {profile.username}
              </p>

              <p className="mt-1 text-sm text-sfx-muted">
                {profile.mobileNumber}
              </p>

              <span className="mt-5 rounded-full bg-sfx-primary/10 px-4 py-2 text-sm font-rh-sb text-sfx-primary">
                Account Tier:
                {" "}
                {profile.tier}
              </span>

              <Button
                onClick={handleUpdate}
                disabled={isSaving}
                className="mt-8 hidden h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90 lg:flex"
              >
                {isEditing
                  ? <MdSave className="size-5" />
                  : <MdEdit className="size-5" />}

                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Save"
                    : "Edit"}
              </Button>
            </div>
          </section>

          <div className="space-y-6 lg:col-span-3">
            <section className="rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand">
              <h2 className="font-rh-b text-lg text-sfx-ink">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-sfx-muted">
                Your personal details associated with your SFx account.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {isEditing
                  ? (
                      <>

                        <EditableField
                          label="First Name"
                          value={profile.firstName}
                          onChange={value => updateField("firstName", value)}
                        />

                        <EditableField
                          label="Middle Name"
                          value={profile.middleName}
                          onChange={value => updateField("middleName", value)}
                        />

                        <EditableField
                          label="Last Name"
                          value={profile.lastName}
                          onChange={value => updateField("lastName", value)}
                        />

                        <EditableField
                          label="Home Country"
                          value={profile.homeCountry}
                          onChange={value => updateField("homeCountry", value)}
                        />

                        <InfoField
                          label="Account Tier"
                          value={profile.tier}
                        />
                      </>
                    )
                  : (
                      <>
                        <InfoField
                          label="Username"
                          value={`@${profile.username}`}
                          disabled
                        />
                        <InfoField
                          label="Mobile Number"
                          value={profile.mobileNumber}
                          disabled
                        />
                        <InfoField
                          label="Email"
                          value={profile.email}
                          disabled
                        />
                        <InfoField label="First Name" value={profile.firstName} />
                        <InfoField label="Middle Name" value={profile.middleName} />
                        <InfoField label="Last Name" value={profile.lastName} />
                        <InfoField label="Home Country" value={profile.homeCountry} />
                        <InfoField label="Account Tier" value={profile.tier} />
                      </>
                    )}
              </div>
            </section>

            <section className="rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand">
              <h2 className="font-rh-b text-lg text-sfx-ink">
                Residential Address
              </h2>

              <p className="mt-1 text-sm text-sfx-muted">
                Your registered residential address.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {isEditing
                  ? (
                      <>
                        <EditableField
                          label="Street Address"
                          value={profile.address.street1}
                          onChange={value => updateAddressField("street1", value)}
                        />

                        <EditableField
                          label="Street Address 2 (Optional)"
                          value={profile.address.street2}
                          onChange={value => updateAddressField("street2", value)}
                        />

                        <EditableField
                          label="City"
                          value={profile.address.city}
                          onChange={value => updateAddressField("city", value)}
                        />

                        <EditableField
                          label="State / Province"
                          value={profile.address.state}
                          onChange={value => updateAddressField("state", value)}
                        />

                        <EditableField
                          label="Postal Code"
                          value={profile.address.postalCode}
                          onChange={value => updateAddressField("postalCode", value)}
                        />

                        <EditableField
                          label="Country"
                          value={profile.address.country}
                          onChange={value => updateAddressField("country", value)}
                        />
                      </>
                    )
                  : (
                      <>
                        <InfoField label="Street Address" value={profile.address.street1} />
                        <InfoField label="Street Address 2 (Optional)" value={profile.address.street2} />
                        <InfoField label="City" value={profile.address.city} />
                        <InfoField label="State / Province" value={profile.address.state} />
                        <InfoField label="Postal Code" value={profile.address.postalCode} />
                        <InfoField label="Country" value={profile.address.country} />
                      </>
                    )}
              </div>

              <Button
                onClick={handleUpdate}
                disabled={isSaving}
                className="mt-8 h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90 lg:hidden"
              >
                {isEditing
                  ? <MdSave className="size-5" />
                  : <MdEdit className="size-5" />}

                {isSaving
                  ? "Saving..."
                  : isEditing
                    ? "Save"
                    : "Edit"}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
