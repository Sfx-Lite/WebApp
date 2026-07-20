import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

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
  );
}
