import { useState } from "react";
import { MdOutlineRemoveRedEye, MdOutlineVisibilityOff } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Register() {
  // Stores what the user types
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    // API calls - placement

    console.warn("Registering user...");
    console.warn({
      password,
      userName,
    });

    setIsLoading(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full bg-[#0d091a] p-0 sm:p-4 md:p-6 select-none">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />

        <div className="absolute -bottom-[30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />
      </div>

      {/* Phone Frame */}
      <div
        className="
          relative
          w-full
          h-screen
          sm:h-[844px]
          sm:w-[390px]
          bg-sfx-primary-tint
          sm:rounded-[44px]
          shadow-brand
          sm:border-[10px]
          sm:border-[#221a38]
          flex
          flex-col
          overflow-hidden
          transition-all
          duration-300
        "
      >
        <div className="p-8 mt-6">
          <h1 className="font-rh-sb text-xl">Create account</h1>
        </div>

        <div className="relative flex justify-center w-80 gap-2 mx-auto">
          <div className="h-1 flex-1 rounded-full bg-sfx-primary" />
          <div className="h-1 flex-1 rounded-full bg-sfx-muted/20" />
          <div className="h-1 flex-1 rounded-full bg-sfx-muted/20" />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5 px-8 mt-8">
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="font-rh-r font-medium text-sfx-muted"
            >
              First name
            </label>

            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="
                  h-12
                  rounded-input
                  border-[1.5px]
                  bg-white
                  text-sfx-ink
                  placeholder:text-sfx-muted
                  mt-2
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sfx-primary-tint
                  focus:border-transparent
                "
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Last name
            </label>

            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
                placeholder:text-sfx-muted
                mt-2
                focus:outline-none
                focus:ring-2
                focus:ring-sfx-primary-tint
                focus:border-transparent
              "
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Username
            </label>

            <Input
              id="username"
              type="text"
              placeholder="Pick a username"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
              className="
                h-12
                rounded-input
                border-[1.5px]
                bg-white
                text-sfx-ink
                placeholder:text-sfx-muted
                mt-2
                focus:outline-none
                focus:ring-2
                focus:ring-sfx-primary-tint
                focus:border-transparent
              "
            />
          </div>
          {/* selecy home country */}
          <div className="space-y-2">
            <label
              htmlFor="home-country"
              className="font-rh-r font-medium text-sfx-muted"
            >
              Home Country
            </label>
            <Select value={country} onValueChange={setCountry} required>
              <SelectTrigger
                id="home-country"
                className="h-12 rounded-input border-[2px] bg-white text-sfx-ink data-placeholder:text-sfx-muted w-full mt-2"
              >
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent className="bg-white" side="bottom">
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Nigeria">Nigeria</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="font-rh-r font-medium text-sfx-muted"
                >
                  Password
                </label>
                <Input
                  className="
                  bg-white
                  h-12
                  py-4
                  rounded-input
                  border-[1.5px]
                  text-sfx-ink
                  placeholder:text-sfx-muted
                  focus:outline-none
                  focus:ring-2
                  focus:ring-sfx-primary-tint
                  focus:border-transparent
                  mt-2
                  "
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={e => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                  absolute
                  right-3
                  bottom-1
                  -translate-y-3
                  text-xs
                  text-sfx-primary
                  "
                >
                  {showPassword
                    ? (
                        <MdOutlineVisibilityOff size="20px" />
                      )
                    : (
                        <MdOutlineRemoveRedEye size="20px" />
                      )}
                </button>
              </div>

              <div className="mt-12">
                <Button
                  type="submit"
                  className="font-rh-sb
                  w-full
                  h-(--spacing-button-h)
                  rounded-button
                  bg-sfx-primary
                  text-sfx-primary-tint
                  hover:bg-sfx-ink hover:text-sfx-primary"
                >
                  {isLoading ? "Creating account..." : "Continue"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
