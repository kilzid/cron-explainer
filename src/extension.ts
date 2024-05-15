import * as vscode from "vscode";
import {
  CronHoverProvider,
  explain as explainCommand,
  validate as validateCommand,
} from "./commands";

export function activate(context: vscode.ExtensionContext) {
  const provider = new CronHoverProvider();
  const disposableHover = vscode.languages.registerHoverProvider("*", provider);
  context.subscriptions.push(disposableHover);

  const disposableExplain = vscode.commands.registerCommand(
    "cron-explainer.explain",
    explainCommand
  );
  context.subscriptions.push(disposableExplain);

  const disposableValidate = vscode.commands.registerCommand(
    "cron-explainer.validate",
    validateCommand
  );
  context.subscriptions.push(disposableValidate);
}

export function deactivate() {}
