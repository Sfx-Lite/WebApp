export function getGoogle() {
  return (window as typeof window & {
    google: any;
  }).google;
}
