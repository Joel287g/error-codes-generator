//? Imports de codigo
import * as VS_CODE from "vscode";

//? Imports de usuario
import { formatErrorCodes, generateErrorCodes } from "./commands";

export function activate(context: VS_CODE.ExtensionContext) {
  const GENERATE_ERRORS = VS_CODE.commands.registerCommand(
    "web-coding-solution.generateErrorCounter",
    generateErrorCodes
  );

  const FORMAT_ERRORS = VS_CODE.commands.registerCommand(
    "web-coding-solution.formatErrorCounter",
    formatErrorCodes
  );

  context.subscriptions.push(GENERATE_ERRORS, FORMAT_ERRORS);
}

export function deactivate(context: VS_CODE.ExtensionContext) {}
