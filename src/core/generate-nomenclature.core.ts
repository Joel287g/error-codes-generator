export function getNomenclature(vscode: any, activeEditor: any) {
  let fileName = activeEditor.document.fileName;
  let workspaceFolders = vscode.workspace.workspaceFolders;
  let splitFileName: any = fileName.split("\\") ?? fileName.split("/");
  let srcPosition = splitFileName.indexOf("src");
  let rootPath = "";
  let projectName = "";

  if (workspaceFolders && workspaceFolders.length > 0) {
    rootPath = workspaceFolders[0].uri.fsPath;
  }

  if (rootPath) {
    projectName =
      (rootPath.split("\\").pop() || rootPath.split("/").pop()) ?? "";
  }

  splitFileName.splice(0, srcPosition + 1);

  const lastPosition = splitFileName.length - 1;

  if (srcPosition === -1) {
    splitFileName.findIndex((element: string) => {
      if (element === projectName) {
        srcPosition = splitFileName.indexOf(element);
      }
    });

    splitFileName.splice(0, srcPosition + 1);
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
