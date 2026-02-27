export const fixMojibake = (value) => {
  if (typeof value !== "string") return value ?? "";
  if (!/[\u00c2\u00c3\u00e2]/.test(value)) return value;

  try {
    const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
    const decoded = new TextDecoder("utf-8").decode(bytes);
    return decoded || value;
  } catch {
    return value;
  }
};
