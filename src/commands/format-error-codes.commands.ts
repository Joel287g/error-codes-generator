//? Imports de codigo
import * as VS_CODE from "vscode";

//? Imports de usuario
import { getNomenclature } from "../core";

export function formatErrorCodes() {
  const ACTIVE_EDITOR = VS_CODE.window.activeTextEditor;

  if (!ACTIVE_EDITOR) {
    VS_CODE.window.showInformationMessage("No active text editor found.");
    return;
  }

  const DOCUMENT = ACTIVE_EDITOR.document.getText();
  const LINES = DOCUMENT.split(/\r?\n/);
  const NOMENCLATURE = getNomenclature(VS_CODE, ACTIVE_EDITOR);

  const NOMENCLATURE_POSITIONS: VS_CODE.Position[] = [];

  //? Obtenemos todas las posiciones de la nomenclatura
  for (let i = 0; i < LINES.length; i++) {
    const LINE = LINES[i];
    let index = -1;

    while ((index = LINE.indexOf(NOMENCLATURE, index + 1)) !== -1) {
      NOMENCLATURE_POSITIONS.push(new VS_CODE.Position(i, index + 1));
    }
  }

  ACTIVE_EDITOR.edit((editBuilder) => {
    let counter = 1;

    //? Iteramos sobre todas las posiciones encontradas
    for (const position of NOMENCLATURE_POSITIONS) {
      //? Obtenemos el rango a reemplazar
      const RANGE = new VS_CODE.Range(
        position.line,
        position.character - 1,
        position.line,
        position.character - 1 + NOMENCLATURE.length + 4
      );

      //? Formateamos el contador a un string de 3 digitos
      let formattedCounter = null;

      formattedCounter = String(counter++).padStart(3, "0");

      //? Reemplazamos los valores de la posicion por la nomenclatura
      editBuilder.replace(RANGE, `${NOMENCLATURE}-${formattedCounter}`);
    }
  });
}
