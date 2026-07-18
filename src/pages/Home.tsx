import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="
      relative
      min-h-screen
      w-full
      bg-[#2e2c36]
      flex
      justify-center
      p-4
      "
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="
          absolute
          -top-40
          -left-20
          w-[60vw]
          h-[60vw]
          rounded-full
          bg-sfx-primary
          opacity-20
          blur-[150px]
          "
        />

        <div
          className="
          absolute
          -bottom-40
          -right-20
          w-[50vw]
          h-[50vw]
          rounded-full
          bg-sfx-primary
          opacity-20
          blur-[150px]
          "
        />
      </div>

      <div
        className="
        relative
        w-full
        max-w-[390px]
        h-screen
        sm:h-[844px]
        bg-sfx-primary-tint
        sm:rounded-[44px]
        sm:border-[10px]
        sm:border-[#221a38]
        shadow-brand
        overflow-hidden
        "
      >
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

          <button
            onClick={() => navigate("/welcome")}
            className="
            w-10
            h-10
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-sfx-primary
            shadow-sm
            cursor-grab
            "
          >
            <MdLogout size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
