import { MdArrowBack } from "react-icons/md";
import { Link, useNavigate } from "react-router";
import ChangePinSetup from "./ChangePinSetup";

export default function UserPinChange() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-xl space-y-5 md:px-screen-x py-6">
      <header className="mb-8 flex items-center gap-2">
        <Link
          to="/security"
          className="rounded-lg p-1 transition-colors hover:bg-sfx-primary/10"
        >
          <MdArrowBack className="size-6 text-sfx-ink" />
        </Link>

        <h1 className="font-rh-sb text-lg text-sfx-ink sm:text-xl">
          Change Transaction PIN
        </h1>
      </header>

      <div className="mx-auto items-center justify-center  ">
        <ChangePinSetup onComplete={() => navigate("/security")} />
      </div>
    </div>
  );
}
