export function b64ToUint8Array(base64: string) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

export function Uint8ArrayTob64(uint8array: Uint8Array) {
  const output = [];
  for (let i = 0, { length } = uint8array; i < length; i++) output.push(String.fromCharCode(uint8array[i]));
  return btoa(output.join(''));
}
