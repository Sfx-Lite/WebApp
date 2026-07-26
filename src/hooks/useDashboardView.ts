import { useCallback } from "react";
import { useSearchParams } from "react-router";

export type DashboardView = "home" | "rates" | "history" | "settings";

const VALID_VIEWS: DashboardView[] = ["home", "rates", "history", "settings"];

function isDashboardView(value: string | null): value is DashboardView {
  return value !== null && (VALID_VIEWS as string[]).includes(value);
}

export function useDashboardView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const viewParam = searchParams.get("view");
  const activeView: DashboardView = isDashboardView(viewParam) ? viewParam : "home";

  const setActiveView = useCallback(
    (view: DashboardView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);

          if (view === "home") {
            params.delete("tab");
          }
          else {
            params.set("tab", view);
          }

          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { activeView, setActiveView };
}
