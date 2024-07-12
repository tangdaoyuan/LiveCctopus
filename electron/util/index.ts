import { v4 } from 'uuid'

export default function slash(path: string) {
  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  }

  return path.replace(/\\/g, '/');
}

export function uuid() {
  return v4().toString()
}
