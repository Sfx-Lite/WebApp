import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router";
import { useGetUserProfileQuery } from "@/api/users";
import QrCode from "@/components/global/QRCode";

type ReceiveFromSFxProps = {
  domain?: string;
};

export default function ReceiveFromSFx({ domain = "sfxlite.app" }: ReceiveFromSFxProps) {
  const { data: user, isLoading } = useGetUserProfileQuery();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const payLink = `${domain}/pay/@${user?.username ?? ""}`;
  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  const handleCopy = async () => {
    if (isLoading || !user)
      return;
    try {
      await navigator.clipboard.writeText(`https://${payLink}`);
      setCopied(true);
      setTimeout(setCopied, 1800, false);
    }
    catch {

    }
  };

  const handleShare = async () => {
    if (isLoading || !user)
      return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} on SFx Lite`,
          text: `Send money to @${user.username} on SFx Lite`,
          url: `https://${payLink}`,
        });
      }
      catch {
        // user cancelled share — no-op
      }
    }
    else {
      handleCopy();
    }
  };

  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-[10px] rounded-full bg-sfx-card"
          >
            <MdArrowBack className="text-[20px]" />
          </button>
          <span className="inline-block font-rh-m">Receive from SFx user</span>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto space-y-6">
          <p className="text-center text-[15px] leading-[20px] text-sfx-muted">
            Ask the sender to scan this code
            <br />
            or send to your username.
          </p>

          <div className="w-full p-(--spacing-card-pad) bg-sfx-card rounded-card space-y-5">
            <div className="w-full aspect-square max-w-[260px] mx-auto">
              <QrCode />
            </div>

            <div className="text-center space-y-1">
              {isLoading
                ? (
                    <div className="flex flex-col items-center gap-2 animate-pulse">
                      <div className="h-[18px] w-[160px] rounded-full bg-sfx-muted/20" />
                      <div className="h-[15px] w-[130px] rounded-full bg-sfx-muted/20" />
                    </div>
                  )
                : (
                    <>
                      <h3 className="font-rh-b text-[18px] leading-[18px] text-sfx-ink">
                        {fullName}
                      </h3>
                      <p className="text-[15px] leading-[18px] text-sfx-primary">
                        @
                        {user?.username}
                        {" "}
                        · SFx Lite
                      </p>
                    </>
                  )}
            </div>
          </div>

          <button
            onClick={handleCopy}
            disabled={isLoading}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-sfx-primary/40 bg-sfx-primary-tint text-sfx-primary text-[15px] font-rh-m transition-colors disabled:opacity-50"
          >
            {copied
              ? (
                  <Check className="size-4 shrink-0" />
                )
              : (
                  <Copy className="size-4 shrink-0" />
                )}
            <span className="truncate">
              {isLoading ? "Loading…" : copied ? "Copied!" : payLink}
            </span>
          </button>
        </div>

        <div className="w-full md:max-w-[50%] mx-auto flex items-center gap-3 pt-6">
          <button
            onClick={handleShare}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-button border-2 border-sfx-primary-tint text-sfx-primary font-rh-m text-[15px] disabled:opacity-50"
          >
            <Share2 className="size-4" />
            Share details
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-4 rounded-button bg-sfx-primary text-white font-rh-m text-[15px]"
          >
            Done
          </button>
        </div>
      </div>
    </section>
  );
}
