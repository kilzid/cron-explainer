import cronstrue from "cronstrue";

export function explainCronExpression(cronExpression: string): string {
  const duration = cronstrue.toString(cronExpression);
  return `This cron expression runs ${duration.toLowerCase()}.`;
}
