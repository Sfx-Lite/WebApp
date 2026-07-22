import { Link } from "react-router";

import logo from "../../assets/imgs/sfx-logo-purple.png";

export default function OnboardingNav() {
  return (
    <nav className="flex gap-[2rem]">
      <Link
        to="/"
        className="w-[100px] object-cover"
      >
        <img
          src={logo}
          alt="company logo"
        />
      </Link>
    </nav>
  );
}
