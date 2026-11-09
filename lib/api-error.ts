// Extracts a displayable message from a NestJS error response
// ({ message: string | string[] }) surfaced through RTK Query's error shape.
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === "object" && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (Array.isArray(message)) return message.join(", ");
      if (typeof message === "string") return message;
    }
  }
  return fallback;
};
