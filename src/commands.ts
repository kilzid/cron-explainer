import * as vscode from "vscode";
import { explainCronExpression } from "./utils";
import { CRON_REGEX, MINUTES_REGEX } from "./regex";

export async function explain() {
  const userResponse = await vscode.window.showInputBox({
    placeHolder: "Type in your cron expression to get an explanation",
  });

  // regex test the user input
  if (!userResponse || !CRON_REGEX.test(userResponse)) {
    vscode.window.showErrorMessage("Invalid cron expression");
    return;
  }

  const explanation = explainCronExpression(userResponse);

  // return the explanation
  vscode.window.showInformationMessage(explanation);
}

export async function validate() {
  const userResponse = await vscode.window.showInputBox({
    placeHolder: "Type in your cron expression to validate it",
  });

  if (!userResponse) {
    vscode.window.showErrorMessage("Invalid cron format.");
    return;
  }

  const parts = userResponse.split(" ");
  if (parts.length !== 5) {
    vscode.window.showErrorMessage("Invalid cron format.");
    return;
  }

  const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
  const response = `${MINUTES_REGEX.test(minutes)} ${MINUTES_REGEX.test(
    hours
  )} ${MINUTES_REGEX.test(dayOfMonth)} ${MINUTES_REGEX.test(
    month
  )} ${MINUTES_REGEX.test(dayOfWeek)}`;

  vscode.window.showInformationMessage(response);
}

export class CronHoverProvider implements vscode.HoverProvider {
  public provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.Hover> {
    // todo: kilzi: should i use this cancellation token?
    const cronRange = document.getWordRangeAtPosition(position, CRON_REGEX);
    if (cronRange) {
      const cron = document.getText(cronRange);
      const explanation = explainCronExpression(cron);
      return new vscode.Hover(explanation, cronRange);
    }
  }
}
