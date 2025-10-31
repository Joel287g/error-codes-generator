//? Imports de codigo
import * as VS_CODE from "vscode";

//? Imports de usuario
import { getNomenclature } from "../core";

export function generateErrorCodes() {
  const ACTIVE_EDITOR = VS_CODE.window.activeTextEditor;

  if (!ACTIVE_EDITOR) {
    VS_CODE.window.showInformationMessage("No active text editor found.");
    return;
  }

  const DOCUMENT = ACTIVE_EDITOR.document.getText();
  const LINES = DOCUMENT.split(/\r?\n/);
  const ERROR_KEYWORD = "ERROR_GENERATOR";
  const NOMENCLATURE = getNomenclature(VS_CODE, ACTIVE_EDITOR);

  const ERROR_POSITIONS: VS_CODE.Position[] = [];
  const NOMENCLATURE_POSITIONS: VS_CODE.Position[] = [];

  //? Obtenemos todas las posiciones de "ERROR_GENERATOR"
  for (let i = 0; i < LINES.length; i++) {
    const LINE = LINES[i];
    let index = -1;

    while ((index = LINE.indexOf(ERROR_KEYWORD, index + 1)) !== -1) {
      ERROR_POSITIONS.push(new VS_CODE.Position(i, index + 1));
    }
  }

  //? Obtenemos todas las posiciones de la nomenclatura
  for (let i = LINES.length - 1; i >= 0; i--) {
    const LINE = LINES[i];
    let index = -1;

    while ((index = LINE.indexOf(NOMENCLATURE, index + 1)) !== -1) {
      NOMENCLATURE_POSITIONS.push(new VS_CODE.Position(i, index + 1));
    }
  }

  //? De las posiciones de las nomenclaturas extraemos los ultimos 3 digitos de cada posicion
  const NOMENCLATURE_VALUES: number[] = [];

  for (const position of NOMENCLATURE_POSITIONS) {
    const LINE = LINES[position.line];
    const START_INDEX = position.character - 1;
    const END_INDEX = START_INDEX + NOMENCLATURE.length + 4;
    const VALUE = LINE.substring(START_INDEX, END_INDEX);
    const VALUE_SPLIT = VALUE.split("-");

    NOMENCLATURE_VALUES.push(Number(VALUE_SPLIT[VALUE_SPLIT.length - 1]));
  }

  NOMENCLATURE_VALUES.sort((a, b) => b - a);

  const MAX_VALUE = NOMENCLATURE_VALUES[0] ?? null;

  ACTIVE_EDITOR.edit((editBuilder) => {
    let counter = 1;

    //? Iteramos sobre todas las posiciones encontradas
    for (const position of ERROR_POSITIONS) {
      //? Obtenemos el rango a reemplazar
      const RANGE = new VS_CODE.Range(
        position.line,
        position.character - 1,
        position.line,
        position.character - 1 + ERROR_KEYWORD.length
      );

      //? Formateamos el contador a un string de 3 digitos
      let formattedCounter = null;

      if (MAX_VALUE && MAX_VALUE !== null) {
        counter = MAX_VALUE + 1;
        formattedCounter = counter.toString().padStart(3, "0");
      } else {
        formattedCounter = String(counter++).padStart(3, "0");
      }

      //? Reemplazamos los valores de la posicion por la nomenclatura
      editBuilder.replace(RANGE, `${NOMENCLATURE}-${formattedCounter}`);
    }
  });
}
