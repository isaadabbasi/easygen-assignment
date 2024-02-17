function getOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `[MISSING ENVIRONMENT VARABLE]: No value found for "${key}"`
    );
  }

  return value;
}

export const APIServerURL = getOrThrow("REACT_APP_API_SERVER_URL");
