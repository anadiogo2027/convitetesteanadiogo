const weddingDate = new Date("2027-08-28T16:00:00+01:00");
const fields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds")
};

function updateCountdown() {
  const distance = Math.max(0, weddingDate.getTime() - Date.now());
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;
  fields.days.textContent = String(Math.floor(distance / day)).padStart(3, "0");
  fields.hours.textContent = String(Math.floor((distance % day) / hour)).padStart(2, "0");
  fields.minutes.textContent = String(Math.floor((distance % hour) / minute)).padStart(2, "0");
  fields.seconds.textContent = String(Math.floor((distance % minute) / 1000)).padStart(2, "0");
}

function downloadCalendarEvent() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Ana e Diogo//Convite de Casamento//PT",
    "BEGIN:VEVENT",
    "UID:ana-diogo-20270828@casamento",
    "DTSTAMP:20260917T000000Z",
    "DTSTART;VALUE=DATE:20270828",
    "DTEND;VALUE=DATE:20270829",
    "SUMMARY:Casamento de Ana e Diogo",
    "LOCATION:Quinta das Rosas, Alenquer",
    "DESCRIPTION:Cerimónia às 16:00.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
  link.download = "ana-e-diogo-28-08-2027.ics";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

const rsvpForm = document.querySelector("#rsvp-form");

rsvpForm.addEventListener("submit", () => {
  const status = document.querySelector("#form-status");
  const diet = rsvpForm.elements.diet.value.trim();
  const message = rsvpForm.elements.message.value.trim();
  const notes = [
    diet && `Restrições alimentares: ${diet}`,
    message && `Mensagem: ${message}`,
  ].filter(Boolean).join("\n\n");

  document.querySelector("#google-notes").value = notes || "Sem observações";
  status.textContent = "A enviar a confirmação…";
  status.classList.remove("success");

  window.setTimeout(() => {
    status.textContent = "Confirmação enviada. Obrigado!";
    status.classList.add("success");
    rsvpForm.reset();
    document.querySelector(".children-details").hidden = true;
  }, 900);
});

const childrenDetails = document.querySelector(".children-details");
document.querySelectorAll('input[name="entry.800389479"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    const hasChildren = radio.value === "Sim" && radio.checked;
    childrenDetails.hidden = !hasChildren;
    childrenDetails.querySelector("select").required = hasChildren;
  });
});

document.querySelector(".map-link").addEventListener("click", (event) => {
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    event.preventDefault();
    window.open("https://maps.apple.com/?q=Quinta+das+Rosas,+Alenquer", "_blank", "noopener");
  }
});
document.querySelector("#add-calendar").addEventListener("click", downloadCalendarEvent);
updateCountdown();
setInterval(updateCountdown, 1000);
