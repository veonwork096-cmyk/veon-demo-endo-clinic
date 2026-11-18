// Clinic facts for the demo homepage. Source: veon/client.json (W-F002, W-F003, W-F004, W-F020).
export const PHONE_MAIN = { href: "tel:+380992687028", display: "+38 (099) 268 70 28" } as const;
export const PHONE_SECOND = { href: "tel:+380673756050", display: "+38 (067) 375 60 50" } as const;
export const EMAIL = "info.endoclinic@gmail.com";
export const ADDRESS = "вул. Івана Чендея 29 Б, Ужгород";
export const MAP_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("вул. Івана Чендея 29 Б, Ужгород");
export const INSTAGRAM = "https://www.instagram.com/endo.clinic/";
export const FACEBOOK = "https://www.facebook.com/TranscarpathianEndoClinic/";
export const SOON = "Розділ у розробці";

/** Weekly schedule, Europe/Kyiv. day: 1 = Monday … 7 = Sunday. */
export const WEEK = [
  { day: 1, name: "Понеділок", short: "Пн", open: "8:00", close: "19:00" },
  { day: 2, name: "Вівторок", short: "Вт", open: "8:00", close: "19:00" },
  { day: 3, name: "Середа", short: "Ср", open: "8:00", close: "19:00" },
  { day: 4, name: "Четвер", short: "Чт", open: "8:00", close: "19:00" },
  { day: 5, name: "П’ятниця", short: "Пт", open: "8:00", close: "19:00" },
  { day: 6, name: "Субота", short: "Сб", open: "9:00", close: "17:00" },
  { day: 7, name: "Неділя", short: "Нд", open: null, close: null },
] as const;
export const HOURS_LINE = "Пн–Пт 8:00–19:00, Сб 9:00–17:00, Нд — вихідний";

export const NAV = [
  { href: "#directions", label: "Напрями" },
  { href: "#checkups", label: "Чек-апи" },
  { href: "#team", label: "Лікарі" },
  { href: "#diagnostics", label: "Діагностика" },
  { href: "#remote", label: "Онлайн" },
  { href: "#contacts", label: "Контакти" },
] as const;
