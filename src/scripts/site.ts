// Endo Clinic homepage behaviour: mobile menu, the axis dot + active nav item, live opening status.
// Everything here is progressive: without JS the page shows the full schedule and every section.

const desktop = window.matchMedia("(min-width: 960px)");

/* ---------- Mobile menu ---------- */
const burger = document.querySelector<HTMLButtonElement>(".burger");
const nav = document.getElementById("site-nav");
if (burger && nav) {
  const setOpen = (open: boolean) => {
    burger.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    document.documentElement.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => setOpen(burger.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      burger.focus();
    }
  });
  desktop.addEventListener("change", (e) => { if (e.matches) setOpen(false); });
}

/* ---------- Axis: the red dot moves to the node of the current section; the nav item gets its dot ---------- */
const nodes = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>("[data-axis-node]").forEach((n) => nodes.set(n.dataset.axisNode ?? "", n));
const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav]");
const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));

const setCurrent = (id: string) => {
  nodes.forEach((n, key) => n.classList.toggle("is-current", key === id));
  links.forEach((a) => {
    const on = a.dataset.nav === id;
    a.classList.toggle("is-active", on);
    if (on) a.setAttribute("aria-current", "location");
    else a.removeAttribute("aria-current");
  });
};

if ("IntersectionObserver" in window && sections.length) {
  const visible = new Map<string, number>();
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
    // The current section is the one crossing the reading line (upper third of the viewport).
    let best = "";
    let bestRatio = 0;
    visible.forEach((ratio, id) => { if (ratio > bestRatio) { best = id; bestRatio = ratio; } });
    if (best && desktop.matches) setCurrent(best);
  }, { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.01, 0.5, 1] });
  sections.forEach((s) => io.observe(s));
  desktop.addEventListener("change", (e) => { if (!e.matches) setCurrent("hero"); });
}

/* ---------- Opening status, Europe/Kyiv (W-F004) ---------- */
type Day = { open: number; close: number } | null;
const WEEK: Record<number, Day> = {
  1: { open: 8, close: 19 }, 2: { open: 8, close: 19 }, 3: { open: 8, close: 19 },
  4: { open: 8, close: 19 }, 5: { open: 8, close: 19 }, 6: { open: 9, close: 17 }, 7: null,
};
const DAY_NAMES: Record<number, string> = { 1: "у понеділок", 2: "у вівторок", 3: "у середу", 4: "у четвер", 5: "у п’ятницю", 6: "у суботу", 7: "у неділю" };

const kyivNow = () => {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const wd = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday")) + 1;
  return { day: wd || 1, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
};

const statusText = (): string => {
  const { day, minutes } = kyivNow();
  const today = WEEK[day];
  if (today && minutes >= today.open * 60 && minutes < today.close * 60) return `Зараз працюємо, до ${today.close}:00.`;
  if (today && minutes < today.open * 60) return `Сьогодні відкриємося о ${today.open}:00.`;
  for (let i = 1; i <= 7; i += 1) {
    const d = ((day - 1 + i) % 7) + 1;
    const next = WEEK[d];
    if (next) return `Відкриємося ${i === 1 ? "завтра" : DAY_NAMES[d]} о ${next.open}:00.`;
  }
  return "";
};

try {
  const text = statusText();
  document.querySelectorAll<HTMLElement>("[data-hours-status]").forEach((el) => {
    el.textContent = text + " ";
    el.hidden = !text;
  });
  const { day } = kyivNow();
  document.querySelector(`.week__row[data-day="${day}"]`)?.classList.add("is-today");
} catch {
  /* Intl without time zones: the full schedule stays */
}
