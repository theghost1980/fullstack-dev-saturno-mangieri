/* Contact details and links used across the site. */
const calLink = "saturno-mangieri/15min"; // Cal.com "username/event"
const calNamespace = "15min"; // the event name, as in the embed code Cal.com gives

export const site = {
  name: "Saturno Mangieri",
  role: "Full-Stack Engineer",
  roleLong: "Full-Stack Engineer // Product Builder",
  email: "saturnob612@gmail.com",
  linkedin: "https://www.linkedin.com/in/saturno-mangieri-011265138",
  github: "https://github.com/theghost1980",
  /* Cal.com referral link, shown in the footer and labelled as a referral. "" hides it. */
  calReferral: "https://refer.cal.com/saturno-mangieri-kyec",
};

/* Attributes for every "Book a call" button. It is a normal link to the Cal.com page
   (what you get without JavaScript); src/scripts/site.js turns it into a dialog.
   Do not rename them to data-cal-*: Cal.com's script reacts to those by itself, and
   the dialog would open twice. */
export const bookAttrs = {
  href: `https://cal.com/${calLink}`,
  "data-book-link": calLink,
  "data-book-namespace": calNamespace,
};
