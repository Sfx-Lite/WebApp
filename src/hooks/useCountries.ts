import { useEffect, useState } from "react";

export type Country = {
  name: string;
  alpha2Code: string;
  callingCodes: string[];
};

const COUNTRIES_ENDPOINT = "https://countries.dev/countries?fields=name,alpha2Code,callingCodes&sort=name";

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchCountries() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(COUNTRIES_ENDPOINT, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to load countries (${res.status})`);
        }
        const data: Country[] = await res.json();

        setCountries(data);
      }
      catch (err) {
        if (err instanceof DOMException && err.name === "AbortError")
          return;
        setError(err instanceof Error ? err.message : "Failed to load countries");
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchCountries();

    return () => controller.abort();
  }, []);

  return { countries, isLoading, error };
}
