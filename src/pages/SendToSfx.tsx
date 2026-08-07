import type { RootState } from "@/store";
import { Check, Loader2, X } from "lucide-react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSaveBeneficiaryMutation } from "@/api/beneficiaries";
import { useCheckUsernameQuery } from "@/api/users";
import { useBeneficiaries } from "@/hooks/useBeneficiaries";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { setNote, setRecipient } from "@/store/sendMoneySlice";

const AVATAR_COLORS = [
  "bg-pink-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
];

function avatarColor(username: string) {
  const index = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export default function SendToSfx() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const draft = useSelector((state: RootState) => state.sendMoney);
  const { beneficiaries } = useBeneficiaries();
  const [saveBeneficiaryMutation] = useSaveBeneficiaryMutation();

  const [username, setUsername] = useState(draft.recipientUsername ?? "");
  const [noteInput, setNoteInput] = useState(draft.note);
  const [saveBeneficiary, setSaveBeneficiary] = useState(true);

  const cleanUsername = username.replace(/^@/, "").trim();
  const debouncedUsername = useDebouncedValue(cleanUsername, 400);

  const { data: usernameResult, isFetching: isChecking } = useCheckUsernameQuery(debouncedUsername, {
    skip: debouncedUsername.length < 2,
  });

  const isResolved = Boolean(usernameResult) && usernameResult!.available === false
    && debouncedUsername === usernameResult!.username;
  const isNotFound = Boolean(usernameResult) && usernameResult!.available === true
    && debouncedUsername === usernameResult!.username;

  const canProceed = isResolved && !isChecking;

  const handleSelectBeneficiary = (beneficiaryUsername: string) => {
    setUsername(`@${beneficiaryUsername}`);
  };

  const handleNext = async () => {
    if (!isResolved || !usernameResult)
      return;

    dispatch(setRecipient({ username: usernameResult.username, displayName: usernameResult.username }));
    dispatch(setNote(noteInput));

    const alreadySaved = beneficiaries.some(
      b => b.type === "internal" && b.identifier === usernameResult.username,
    );

    if (saveBeneficiary && !alreadySaved) {
      try {
        await saveBeneficiaryMutation({
          type: "internal",
          identifier: usernameResult.username,
          name: usernameResult.username,
        }).unwrap();
      }
      catch {
      }
    }

    navigate("/sendmoney/sfxs/amount");
  };

  return (
    <section className="py-[25px] md:px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sendmoney")}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">
            Send to SFx user
          </span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Username</span>
            <div className="relative">
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-4 py-3 rounded-2xl bg-sfx-card font-rh-m text-[16px] outline-none focus:ring-2 focus:ring-sfx-primary/30"
              />
              {/* <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sfx-primary"
                aria-label="Scan QR code"
              >
                <ScanLine className="size-5" />
              </button> */}
            </div>

            {isChecking && cleanUsername.length >= 2 && (
              <p className="flex items-center gap-1.5 text-[14px] text-sfx-muted">
                <Loader2 className="size-3.5 animate-spin" />
                Checking username…
              </p>
            )}
            {!isChecking && isResolved && (
              <p className="flex items-center gap-1.5 text-[14px] text-sfx-success">
                <Check className="size-3.5" />
                {usernameResult!.username}
                {" "}
                · SFx Lite user
              </p>
            )}
            {!isChecking && isNotFound && (
              <p className="flex items-center gap-1.5 text-[14px] text-sfx-danger">
                <X className="size-3.5" />
                No SFx Lite user with that username
              </p>
            )}
          </div>

          <div className="space-y-2">
            <span className="inline-block text-[14px] text-sfx-muted">Note (optional)</span>
            <input
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="What's it for?"
              className="w-full px-4 py-3 rounded-2xl bg-sfx-card font-rh-m text-[15px] outline-none focus:ring-2 focus:ring-sfx-primary/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-rh-m text-[15px]">Save beneficiary</span>
            <button
              type="button"
              onClick={() => setSaveBeneficiary(prev => !prev)}
              className={`relative h-[26px] w-[46px] rounded-full transition-colors ${
                saveBeneficiary ? "bg-sfx-primary" : "bg-sfx-muted/30"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] size-[20px] rounded-full bg-white transition-transform ${
                  saveBeneficiary ? "translate-x-[20px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {beneficiaries.length > 0 && (
            <div className="space-y-2">
              <span className="inline-block uppercase text-[13px] font-rh-sb text-sfx-muted tracking-wider">
                Beneficiaries
              </span>
              <div className="space-y-2.5">
                {beneficiaries.map(b => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBeneficiary(b.username ?? b.identifier)}
                    className="w-full flex items-center gap-3 p-(--spacing-card-pad) bg-sfx-card rounded-card text-left"
                  >
                    {b.profileImage
                      ? (
                          <img
                            src={b.profileImage}
                            alt={b.name}
                            className="size-10 rounded-full object-cover"
                          />
                        )
                      : (
                          <div className={`flex size-10 items-center justify-center rounded-full text-white font-rh-b ${avatarColor(b.identifier)}`}>
                            {b.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                    <div>
                      <p className="font-rh-b text-[15px]">{b.name}</p>
                      <p className="text-[13px] text-sfx-muted">
                        @
                        {b.username ?? b.identifier}
                        {" "}
                        · SFx Lite
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:max-w-[50%] mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className="w-full py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
