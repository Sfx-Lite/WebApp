import { ArrowDownLeft, Eye, Plus, Send } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  return (
    <section className="py-[25px] px-screen-x">
      <div className="space-y-[2rem]">
        <div className="flex gap-6">
          <div className="w-1/2 p-card-pad rounded-card space-y-[.75rem] bg-sfx-card shadow-lg">
            <div className="flex items-center gap-2">
              <p className="text-[14px] text-sfx-muted">
                Main account balance
              </p>

              <button>
                <Eye className="w-[18px] text-sfx-muted" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-end gap-0.5">
                <h1 className="text-[36px] leading-[36px] font-rh-sb">
                  $128.40
                </h1>
                <span className="uppercase tracking-tight text-sfx-muted">
                  USD
                </span>
              </div>
              <div className="flex items-end gap-0.5">
                <span className="text-[15px] text-sfx-muted font-rh-sb">
                  ≈ $128.40
                </span>
                <span className="text-[15px] text-sfx-muted">
                  USD
                </span>
                <span className="text-[15px] text-sfx-muted">
                  · Polygon Amoy
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="w-1/2 py-[12px] px-[25px] flex items-center justify-center gap-1 rounded-full bg-sfx-primary hover:scale-95 transition-transform duration-300"
              >
                <Plus className="w-[20px] text-white" />
                <span className="text-white font-rh-m">
                  Add
                </span>
              </button>
              <button
                className="w-1/2 py-[12px] px-[25px] flex items-center justify-center gap-1 rounded-full bg-sfx-card border border-sfx-primary hover:scale-95 transition-transform duration-300"
              >
                <Send className="w-[20px] text-sfx-primary" />
                <span className="text-sfx-primary font-rh-m">
                  Send
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-card-pad bg-sfx-amber-bg rounded-card border-l-4 border-l-sfx-amber">
          <p className="text-sfx-amber">
            Testnet environment — balances are test USDC with no real-world value.
          </p>
        </div>

        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-block uppercase font-rh-sb text-sfx-muted tracking-wider">
              Recent transactions
            </span>

            <Link
              to="/"
              className="text-sfx-primary font-rh-sb"
            >
              See all
            </Link>
          </div>

          <ul className="space-y-3">
            <li className="flex items-center justify-between p-card-pad rounded-card bg-sfx-card">
              <div className="flex items-center gap-3">
                <div className="size-[45px] flex items-center justify-center p-[5px] rounded-[10px] bg-sfx-success-bg">
                  <ArrowDownLeft className="w-[25px]  text-sfx-success" />
                </div>
                <div className="flex flex-col">
                  <span className="inline-block font-rh-sb">
                    Deposit · USDC
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-sfx-muted">
                    <span className="text-[15px]">
                      Today, 2:14pm
                    </span>
                    <span>
                      ·
                    </span>
                    <span className="text-[14px] font-rh-sb text-sfx-success bg-sfx-success-bg rounded-full py-[1px] px-2">
                      Successful
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sfx-success text-[20px] font-rh-sb">
                +$50.00
              </p>
            </li>
            <li className="flex items-center justify-between p-card-pad rounded-card bg-sfx-card">
              <div className="flex items-center gap-3">
                <div className="size-[45px] flex items-center justify-center p-[5px] rounded-[10px] bg-sfx-success-bg">
                  <ArrowDownLeft className="w-[25px]  text-sfx-success" />
                </div>
                <div className="flex flex-col">
                  <span className="inline-block font-rh-sb">
                    Deposit · USDC
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-sfx-muted">
                    <span className="text-[15px]">
                      Today, 2:14pm
                    </span>
                    <span>
                      ·
                    </span>
                    <span className="text-[14px] font-rh-sb text-sfx-success bg-sfx-success-bg rounded-full py-[1px] px-2">
                      Successful
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-sfx-success text-[20px] font-rh-sb">
                +$50.00
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
