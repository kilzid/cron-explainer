import cronstrue from "cronstrue";

export function explainCronExpression(cronExpression: string): string {
  if (!validateCronExpression(cronExpression)) {
    return "";
  }

  try {
    const duration = cronstrue.toString(cronExpression);
    return `This cron expression runs ${duration.toLowerCase()}.`;
  } catch (error) {
    return error as string;
  }
}

export function validateCronExpression(cronExpression: string): boolean {
  const parts = cronExpression.split(" ");
  switch (parts.length) {
    case 5:
      const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
      const minutesValidation = validateMinutes(minutes);
      if (!minutesValidation.valid) {
        return false;
      }

      const hoursValidation = validateHours(hours);
      if (!hoursValidation.valid) {
        return false;
      }

      // todo: kilzi: validate dayOfMonth, month, dayOfWeek
      return true;
    case 6:
    case 7:
    default:
      // todo: kilzi: handle 6-7 part cron expressions
      return false;
  }
}

function validateMinutesOrHours(value: string, type: "minutes" | "hours") {
  if (value === "*") {
    return { valid: true, message: "" };
  }
  const maxValue = type === "minutes" ? 59 : 23;

  const parts = value.split(",");
  const results = parts.map((part) => {
    if (part.includes("-")) {
      // i.e "0-6"
      let [start, end, ...rest] = part.split("-");
      if (rest.length > 0) {
        // i.e "0-6-7"
        return { valid: false, message: `invalid ${type} part` };
      }

      if (start.includes("/")) {
        // i.e "0/2-6"
        return {
          valid: false,
          message: `in range, start value cannot contain "/"`,
        };
      }

      let step;
      if (end.includes("/")) {
        // i.e "0-6/2"
        if (end.split("/").length > 2) {
          // i.e "0-6/2/3"
          return { valid: false, message: `invalid ${type} part` };
        }
        [end, step] = end.split("/");
      }

      start = trimLeadingZeros(start);
      end = trimLeadingZeros(end);
      const startAsNumber = parseInt(start, 10);
      const endAsNumber = parseInt(end, 10);
      if (
        isNaN(startAsNumber) ||
        isNaN(endAsNumber) ||
        startAsNumber.toString() !== start ||
        endAsNumber.toString() !== end
      ) {
        // "0-a" or "a-6"
        return {
          valid: false,
          message: "start and end values must be numbers",
        };
      }
      if (startAsNumber < 0 || startAsNumber > maxValue) {
        // "-3-6" or "65-90"
        return {
          valid: false,
          message: `start value must be between 0 and ${maxValue}`,
        };
      }
      if (endAsNumber < 0 || endAsNumber > maxValue) {
        // "20-65"
        return {
          valid: false,
          message: `end value must be between 0 and ${maxValue}`,
        };
      }
      if (startAsNumber >= endAsNumber) {
        // "6-3"
        return {
          valid: false,
          message: "end value must be greater than start value",
        };
      }

      if (step) {
        step = trimLeadingZeros(step);
        const stepAsNumber = parseInt(step, 10);
        if (isNaN(stepAsNumber) || stepAsNumber.toString() !== step) {
          // "0-6/a" or "0-6/3a"
          return { valid: false, message: "step value must be a number" };
        }
        if (stepAsNumber < 1 || stepAsNumber > maxValue) {
          // "0-6/-1" or "0-6/65"
          return {
            valid: false,
            message: `step value must be between 1 and ${maxValue}`,
          };
        }
      }
    } else if (part.includes("/")) {
      //i.e  "0/2"
      let [start, step, ...rest] = part.split("/");
      if (rest.length > 0) {
        // i.e "0/2/3"
        return { valid: false, message: `invalid ${type} part` };
      }
      start = trimLeadingZeros(start);
      step = trimLeadingZeros(step);
      const startAsNumber = parseInt(start, 10);
      const stepAsNumber = parseInt(step, 10);
      if (
        isNaN(startAsNumber) ||
        isNaN(stepAsNumber) ||
        startAsNumber.toString() !== start ||
        stepAsNumber.toString() !== step
      ) {
        // "0/a" or "a/2"
        return {
          valid: false,
          message: "start and step values must be numbers",
        };
      }
      if (startAsNumber < 0 || startAsNumber > maxValue) {
        // i.e "-3/2" or "65/2"
        return {
          valid: false,
          message: `start value must be between 0 and ${maxValue}`,
        };
      }
      if (stepAsNumber < 1 || stepAsNumber > maxValue) {
        // i.e "2/-1" or "2/65"
        return {
          valid: false,
          message: `step value must be between 1 and ${maxValue}`,
        };
      }
    } else {
      // i.e "5"
      part = trimLeadingZeros(part);
      const partAsNumber = parseInt(part, 10);
      if (isNaN(partAsNumber) || partAsNumber.toString() !== part) {
        // i.e "a"
        return { valid: false, message: "part value must be a number" };
      }
      if (partAsNumber < 0 || partAsNumber > maxValue) {
        // i.e "-1" or "65"
        return {
          valid: false,
          message: `part value must be between 0 and ${maxValue}`,
        };
      }
    }

    return { valid: true, message: "" };
  });
  const invalidResult = results.find((result) => !result.valid);
  if (invalidResult) {
    return invalidResult;
  }
  return { valid: true, message: "" };
}

function validateMinutes(minutes: string): { valid: boolean; message: string } {
  return validateMinutesOrHours(minutes, "minutes");
}

function validateHours(hours: string): { valid: boolean; message: string } {
  return validateMinutesOrHours(hours, "hours");
}

function trimLeadingZeros(text: string) {
  while (text.startsWith("0") && text.length > 1) {
    text = text.slice(1);
  }
  return text;
}
