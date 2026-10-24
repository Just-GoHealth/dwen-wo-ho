/** Multipart body for the v2 image uploads: one part named `file` (JPEG, PNG or WEBP, 5 MB max). */
export function fileForm(file: Blob): FormData {
  const form = new FormData();
  form.append("file", file);
  return form;
}

/** Path segment, encoded. */
export const seg = (value: string | number) =>
  encodeURIComponent(String(value));
