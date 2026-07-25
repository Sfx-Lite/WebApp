import { useState } from "react";
import { MdArrowBack, MdEdit, MdOutlinePerson, MdSave } from "react-icons/md";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

type InfoFieldProps = {
  label: string;
  value: string;
  disabled?: boolean;

};

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
          Username cannot be changed.
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
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-sfx-ink/20 bg-sfx-primary-tint px-4 py-3 font-rh-sb text-sfx-ink outline-none focus:border-sfx-primary"
      />
    </div>
  );
}

export default function UserProfile() {
  const user = {
    firstName: "John",
    middleName: "Alexander",
    lastName: "Doe",
    username: "johndoe",
    mobileNumber: "+234 801 234 5678",
    accountTier: "Tier 2",
    homeCountry: "Nigeria",

    address: {
      street1: "12 Admiralty Way",
      street2: "Apartment 3B",
      city: "Lekki",
      state: "Lagos",
      postalCode: "105102",
      country: "Nigeria",
    },
  };

  const [profile, setProfile] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const updateField = (
    field: keyof typeof profile,
    value: string,
  ) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateAddressField = (
    field: keyof typeof profile.address,
    value: string,
  ) => {
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  const handleUpdate = () => {
    if (isEditing) {
      // console.log(profile);
    }

    setIsEditing(prev => !prev);
  };

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
                {profile.accountTier}
              </span>

              <Button
                onClick={handleUpdate}
                className="mt-8 hidden h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90 lg:flex"
              >
                {isEditing
                  ? <MdSave className="size-5" />
                  : <MdEdit className="size-5" />}

                {isEditing ? "Save Changes" : "Edit"}
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
                          value={profile.accountTier}
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
                        <InfoField label="First Name" value={profile.firstName} />
                        <InfoField label="Middle Name" value={profile.middleName} />
                        <InfoField label="Last Name" value={profile.lastName} />
                        <InfoField label="Home Country" value={profile.homeCountry} />
                        <InfoField label="Account Tier" value={profile.accountTier} />
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
                className="mt-8 h-button-h w-full rounded-button bg-sfx-primary font-rh-sb text-white shadow-brand hover:bg-sfx-ink/90 lg:hidden"
              >
                {isEditing
                  ? <MdSave className="size-5" />
                  : <MdEdit className="size-5" />}

                {isEditing ? "Save Changes" : "Edit"}
              </Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
