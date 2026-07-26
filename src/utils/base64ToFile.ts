export function base64ToFile( // this function will accept 2 inputs from the user
  base64: string, // long text string
  filename: string,
): File { // meaning the function will return a Javascript file object for the backend
  const arr = base64.split(","); // splits the base64string into 2 parts where the comma seperates it tbh

  const mime = arr[0] // after splitting , it forms an array
    .match(/:(.*?);/)?.[1] ?? "image/jpeg"; // which will contains info about the image and image type

  const bstr = atob(arr[1]); // converts the data into binary text

  let n = bstr.length; // storing the size of the binary data

  const u8arr = new Uint8Array(n); // creates an empty array of bytes

  while (n--) { // where the conversion loop happens , using n as a counter
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File(
    [u8arr],
    filename,
    {
      type: mime,
    },
  );
}
