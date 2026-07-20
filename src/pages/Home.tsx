import LogOutBtn from "@/components/global/LogOutBtn";

export default function Home() {
  return (
    <div>
      <div
        className="
          flex
          items-center
          justify-between
          px-8
          pt-12
          "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-sfx-primary-strong
              text-white
              font-extrabold
              flex
              items-center
              justify-center
              text-sm
              shadow-[0_4px_12px_rgba(140,82,255,0.2)]
              "
          >
            AO
          </div>

          <div>
            <p
              className="
                text-sm
                text-sfx-muted
                font-rh-r
                "
            >
              Good Evening
            </p>

            <h1
              className="
                text-xl
                font-rh-sb
                text-sfx-ink
                mt-0.5
                "
            >
              Amara Okafor
            </h1>

            <p
              className="
                text-xs
                text-sfx-primary
                font-rh-r
                mt-1
                "
            >
              @amara
            </p>
          </div>
        </div>

        <LogOutBtn />
      </div>
    </div>
  );
}
