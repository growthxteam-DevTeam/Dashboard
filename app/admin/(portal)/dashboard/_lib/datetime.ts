const pad = (value: number) => String(value).padStart(2, "0");

// <input type="datetime-local"> works in the admin's local time with no timezone suffix.
export const toDateTimeLocal = (iso: string | null): string => {
  if (!iso) return "";
  const date = new Date(iso);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fromDateTimeLocal = (value: string): string => new Date(value).toISOString();
