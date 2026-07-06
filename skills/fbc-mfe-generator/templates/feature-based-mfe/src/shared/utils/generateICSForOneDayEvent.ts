export function generateICSForOneDayEvent({
  title,
  description,
  date,
  location
}: {
  title: string;
  description?: string;
  date: Date;
  location?: string;
}) {
  const formatDate = (d: Date) =>
    d.toISOString().split("T")[0].replace(/-/g, "");

  const start = formatDate(date);
  const end = formatDate(new Date(date.getTime() + 24 * 60 * 60 * 1000)); // +1 day

  return `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourCompany//Inspection Scheduler//EN
BEGIN:VEVENT
UID:${Date.now()}@yourcompany.com
DTSTAMP:${formatDate(new Date())}
DTSTART;VALUE=DATE:${start}
DTEND;VALUE=DATE:${end}
SUMMARY:${title}
DESCRIPTION:${description || ""}
LOCATION:${location || ""}
END:VEVENT
END:VCALENDAR
  `.trim();
}

