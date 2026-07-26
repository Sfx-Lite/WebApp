import { useEffect, useState } from "react";
import { MdArrowBack, MdEdit, MdOutlinePerson, MdSave } from "react-icons/md";
import { Link } from "react-router";
import { toast } from "sonner";
import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/store/useUserStore";

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

      <div
        className={`rounded-xl border px-4 py-3 font-rh-sb text-sfx-ink ${
          disabled
            ? "border-sfx-ink/10 bg-sfx-primary-tint/10"
            : "border-sfx-ink/20 bg-sfx-primary-tint/20"
        }`}
      >
        <span className="font-rh-sb text-sfx-ink">{value || "—"}</span>
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

function EditableField({ label, value, onChange }: EditableFieldProps) {
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
  const { profile, isLoading, error, fetchProfile, setProfile } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<UserProfileData | null>(null);

  //  Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  //  Tis will sync draft state when store profile changes
  useEffect(() => {
    if (profile) {
      // eslint-disable-next-line react/set-state-in-effect
      setDraft(profile);
    }
  }, [profile]);

  // Update draft form state
  const updateField = (field: keyof UserProfileData, value: string) => {
    setDraft(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const updateAddressField = (field: keyof Address, value: string) => {
    setDraft(prev =>
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

    if (!draft)
      return;

    try {
      setIsSaving(true);

      const payload = {
        mobileNumber: draft.mobileNumber,
        firstName: draft.firstName,
        middleName: draft.middleName,
        lastName: draft.lastName,
        streetAddress1: draft.address.street1,
        streetAddress2: draft.address.street2,
        city: draft.address.city,
        state: draft.address.state,
        country: draft.address.country,
      };

      await api.patch(USER_PROFILE_URL, payload);

      // Save updated draft to Zustand global store
      setProfile(draft);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    }
    catch (err: any) {
      const errorMessage
        = err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(errorMessage);
    }
    finally {
      setIsSaving(false);
    }
  };

  // Cancel edit mode and reset draft back to current store state
  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-sfx-primary-tint">
        <p className="font-rh-sb text-sfx-ink">
          <Spinner />
        </p>
      </div>
    );
  }

  if (error || !profile || !draft) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-sfx-primary-tint">
        <p className="font-rh-sb text-red-500">
          {error || "User profile not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-y-auto bg-sfx-primary-tint">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4 sm:p-6 lg:max-w-5xl lg:p-8">
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
          <section className="h-fit rounded-2xl border border-sfx-ink/20 bg-white p-6 shadow-brand">
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

              <div className="mt-8 hidden w-full flex-col gap-2 lg:flex">
                <Button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90"
                >
                  {isEditing
                    ? (
                        <MdSave className="size-5" />
                      )
                    : (
                        <MdEdit className="size-5" />
                      )}
                  {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                </Button>

                {isEditing && (
                  <Button
                    onClick={handleCancel}
                    disabled={isSaving}
                    variant="outline"
                    className="h-button-h w-full rounded-button font-rh-sb"
                  >
                    Cancel
                  </Button>
                )}
              </div>
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
                          label="Mobile Number"
                          value={draft.mobileNumber}
                          onChange={value => updateField("mobileNumber", value)}
                        />

                        <EditableField
                          label="First Name"
                          value={draft.firstName}
                          onChange={value => updateField("firstName", value)}
                        />

                        <EditableField
                          label="Middle Name"
                          value={draft.middleName}
                          onChange={value => updateField("middleName", value)}
                        />

                        <EditableField
                          label="Last Name"
                          value={draft.lastName}
                          onChange={value => updateField("lastName", value)}
                        />

                        <EditableField
                          label="Home Country"
                          value={draft.homeCountry}
                          onChange={value => updateField("homeCountry", value)}
                        />

                        <InfoField label="Account Tier" value={draft.tier} />
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
                        />
                        <InfoField
                          label="Email"
                          value={profile.email}
                          disabled
                        />
                        <InfoField label="First Name" value={profile.firstName} />
                        <InfoField label="Middle Name" value={profile.middleName} />
                        <InfoField label="Last Name" value={profile.lastName} />
                        <InfoField
                          label="Home Country"
                          value={profile.homeCountry}
                        />
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
                          value={draft.address.street1}
                          onChange={value => updateAddressField("street1", value)}
                        />

                        <EditableField
                          label="Street Address 2 (Optional)"
                          value={draft.address.street2}
                          onChange={value => updateAddressField("street2", value)}
                        />

                        <EditableField
                          label="City"
                          value={draft.address.city}
                          onChange={value => updateAddressField("city", value)}
                        />

                        <EditableField
                          label="State / Province"
                          value={draft.address.state}
                          onChange={value => updateAddressField("state", value)}
                        />

                        <EditableField
                          label="Postal Code"
                          value={draft.address.postalCode}
                          onChange={value => updateAddressField("postalCode", value)}
                        />

                        <EditableField
                          label="Country"
                          value={draft.address.country}
                          onChange={value => updateAddressField("country", value)}
                        />
                      </>
                    )
                  : (
                      <>
                        <InfoField
                          label="Street Address"
                          value={profile.address.street1}
                        />
                        <InfoField
                          label="Street Address 2 (Optional)"
                          value={profile.address.street2}
                        />
                        <InfoField label="City" value={profile.address.city} />
                        <InfoField
                          label="State / Province"
                          value={profile.address.state}
                        />
                        <InfoField
                          label="Postal Code"
                          value={profile.address.postalCode}
                        />
                        <InfoField
                          label="Country"
                          value={profile.address.country}
                        />
                      </>
                    )}
              </div>

              <div className="mt-8 flex flex-col gap-2 lg:hidden">
                <Button
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90"
                >
                  {isEditing
                    ? (
                        <MdSave className="size-5" />
                      )
                    : (
                        <MdEdit className="size-5" />
                      )}
                  {isSaving ? "Saving..." : isEditing ? "Save" : "Edit"}
                </Button>

                {isEditing && (
                  <Button
                    onClick={handleCancel}
                    disabled={isSaving}
                    variant="outline"
                    className="h-button-h w-full rounded-button font-rh-sb"
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
