import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useGetUserProfileQuery } from "@/api/users";

export default function UserProfileCard() {
  const { data: user, isLoading } = useGetUserProfileQuery();
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopyUsername() {
    if (!user?.username)
      return;
    await navigator.clipboard.writeText(`@${user.username}`);
    setIsCopied(true);
    setTimeout(setIsCopied, 1500, false);
  }

  return (
    <div className="p-2 rounded-[10px] bg-sfx-card shadow-md border border-sfx-muted/20 my-[1.75rem]">
      <div className="flex items-center gap-2">
        <button className="h-[2.25rem] w-[2.25rem] rounded-full">
          <img
            src={user?.avatarUrl ?? "/sneaks.jpg"}
            alt={user?.firstName ?? "User avatar"}
            className="h-full w-full rounded-[inherit] object-cover"
          />
        </button>

        <div className="flex flex-col leading-4">
          <span className="inline-block font-rh-b text-[15px]">
            {isLoading ? "…" : `${user?.firstName} ${user?.lastName}`}
          </span>
          <span className="inline-flex items-center gap-2 text-sfx-muted font-rh-m text-[14px]">
            {isLoading ? "…" : `@${user?.username}`}
            {!isLoading && user?.username && (
              <button onClick={handleCopyUsername} className="inline-flex">
                {isCopied
                  ? (
                      <Check className="w-[13px] text-sfx-success" />
                    )
                  : (
                      <Copy className="w-[13px] text-sfx-muted" />
                    )}
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
