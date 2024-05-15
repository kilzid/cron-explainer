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
    if (part.includes("/")) {
      const [start, step, ...rest] = part.split("/");
      if (rest.length > 0) {
        return { valid: false, message: `invalid ${type} part` };
      }
      const startAsNumber = parseInt(start);
      const stepAsNumber = parseInt(step);
      if (isNaN(startAsNumber) || isNaN(stepAsNumber)) {
        return {
          valid: false,
          message: "start and step values must be numbers",
        };
      }
      if (startAsNumber < 0 || startAsNumber > maxValue) {
        return {
          valid: false,
          message: `start value must be between 0 and ${maxValue}`,
        };
      }
      if (stepAsNumber < 1 || stepAsNumber > maxValue) {
        return {
          valid: false,
          message: `step value must be between 1 and ${maxValue}`,
        };
      }
    } else if (part.includes("-")) {
      const [start, end, ...rest] = part.split("-");
      if (rest.length > 0) {
        return { valid: false, message: `invalid ${type} part` };
      }
      const startAsNumber = parseInt(start);
      const endAsNumber = parseInt(end);
      if (isNaN(startAsNumber) || isNaN(endAsNumber)) {
        return {
          valid: false,
          message: "start and end values must be numbers",
        };
      }
      if (startAsNumber < 0 || startAsNumber > maxValue) {
        return {
          valid: false,
          message: `start value must be between 0 and ${maxValue}`,
        };
      }
      if (endAsNumber < 0 || endAsNumber > maxValue) {
        return {
          valid: false,
          message: `end value must be between 0 and ${maxValue}`,
        };
      }
      if (startAsNumber >= endAsNumber) {
        return {
          valid: false,
          message: "end value must be greater than start value",
        };
      }
    } else {
      const partAsNumber = parseInt(part);
      if (isNaN(partAsNumber)) {
        return { valid: false, message: "part value must be a number" };
      }
      if (partAsNumber < 0 || partAsNumber > maxValue) {
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
