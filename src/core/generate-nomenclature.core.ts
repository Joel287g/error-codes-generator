export function getNomenclature(vscode: any, activeEditor: any) {
  let fileName = activeEditor.document.fileName;
  let splitFileName: any = fileName.split("\\") ?? fileName.split("/");
  let srcPosition = splitFileName.indexOf("src");

  splitFileName.splice(0, srcPosition + 1);

  const lastPosition = splitFileName.length - 1;

  if (srcPosition === -1) {
    vscode.window.showInformationMessage(
      "No 'src' folder found in the file path."
    );
    return;
  }

  for (const element of splitFileName) {
    const position = splitFileName.indexOf(element);

    splitFileName[position] = element.toUpperCase();

    if (position === 0) {
      splitFileName[position] = element.toUpperCase().slice(0, 4);
    } else if (position !== lastPosition) {
      splitFileName[position] = splitFileName[position].slice(0, 3);
    } else {
      let lastElement: any = (splitFileName[position] =
        splitFileName[position].split(".")[0]);

      lastElement = lastElement.split("-");

      for (const element of lastElement) {
        const position = lastElement.indexOf(element);

        lastElement[position] = element.slice(0, 4);
      }

      splitFileName[position] = lastElement.join("_");
    }
  }

  return (splitFileName = splitFileName.join("-"));
}
