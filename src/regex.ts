// todo: kilzi: verify this regex
export const MINUTES_REGEX =
  /(\*|(((\d{1,2})([-\/]\d{1,2}){0,1})(,((\d{1,2})([-\/]\d{1,2}){0,1}))*))/;
export const HOURS_REGEX =
  /(\*|(((\d{1,2})([-\/]\d{1,2}){0,1})(,((\d{1,2})([-\/]\d{1,2}){0,1}))*))/;
export const DAY_OF_MONTH_REGEX =
  /(\*|(?:[1-9]|(?:[12][0-9])|3[01])(?:(?:\-(?:[1-9]|(?:[12][0-9])|3[01]))?|(?:\,(?:[1-9]|(?:[12][0-9])|3[01]))*))/;
export const MONTH_REGEX =
  /(\*|(?:[1-9]|1[012]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:\-(?:[1-9]|1[012]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?|(?:\,(?:[1-9]|1[012]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))*))/;
export const DAY_OF_WEEK_REGEX =
  /(\*|(?:[0-6]|SUN|MON|TUE|WED|THU|FRI|SAT)(?:(?:\-(?:[0-6]|SUN|MON|TUE|WED|THU|FRI|SAT))?|(?:\,(?:[0-6]|SUN|MON|TUE|WED|THU|FRI|SAT))*))/;
const combinedPattern = `${MINUTES_REGEX.source} ${HOURS_REGEX.source} ${DAY_OF_MONTH_REGEX.source} ${MONTH_REGEX.source} ${DAY_OF_WEEK_REGEX.source}`;
export const CRON_REGEX = new RegExp(combinedPattern);
