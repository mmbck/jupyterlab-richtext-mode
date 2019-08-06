import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import '../style/index.css';
import { INotebookTracker,
  //  NotebookActions, 
  //  NotebookPanel 
  } from '@jupyterlab/notebook';
import ProseMirrorEditor from './ProsemirrorWidget';
import { MarkdownCell } from '@jupyterlab/cells';
import {
  // Panel,
  PanelLayout
} from '@phosphor/widgets';

function activateMarkdownTest(app: JupyterFrontEnd, nbTracker: INotebookTracker) {

  // nbTracker.activeCellChanged.connect(() => {
  //   const activeCell = nbTracker.activeCell;
  //   if (activeCell instanceof MarkdownCell) {
  //     console.log("The active cell is now markdown.");
  //     const markdownCell = activeCell;
  //     const widget = new ProseMirrorEditor(markdownCell);
  //     markdownCell.inputArea.renderInput(widget);
  // }
  // });

  nbTracker.activeCellChanged.connect(() => {
    // console.log(nbTracker.activeCell);
    if (nbTracker.activeCell) {
      nbTracker.activeCell.node.addEventListener('dblclick', (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("event handled!!");
            if (nbTracker.activeCell instanceof MarkdownCell) {
              const markdownCell = nbTracker.activeCell;
              const widget = new ProseMirrorEditor(markdownCell);
              markdownCell.inputArea.renderInput(widget);     
      }});
    }

  })

  createRunCommand(app, nbTracker);

}

function createRunCommand(app: JupyterFrontEnd, nbTracker: INotebookTracker) {

  const ctrlRunCommand = "rich-text:run-markdown-cell";
  app.commands.addCommand(ctrlRunCommand, {
    execute: () => {
      const activeCellPanel = (nbTracker.activeCell.layout as PanelLayout).widgets[1];
      const activeCellInputArea = (activeCellPanel.layout as PanelLayout).widgets[1];
      const activeCellProsemirrorEditor = (activeCellInputArea.layout as PanelLayout).widgets[2];
      (activeCellProsemirrorEditor as ProseMirrorEditor).runCommand();
    }
  })

  const shiftRunCommand = "rich-text:run-markdown-cell-and-advance";
  app.commands.addCommand(shiftRunCommand, {
    execute: () => {
      app.commands.execute("rich-text:run-markdown-cell")
      app.commands.execute("notebook:run-cell-and-select-next");
      // NotebookActions.run((nbTracker.currentWidget as NotebookPanel).content);
      console.log(app.commands);
      // console.log(nbTracker.activeCell);
    }
  });

  app.commands.addKeyBinding({
    command: shiftRunCommand,
    keys: ["Shift Enter"],
    selector: '.editor'
  });

  app.commands.addKeyBinding({
    command: ctrlRunCommand,
    keys: ["Ctrl Enter"],
    selector: '.editor'
  });


}

/**
 * Initialization data for the wyswiwyg-editor extension.
 */
const markdownTest: JupyterFrontEndPlugin<void> = {
  id: 'test-markdown',
  autoStart: true,
  requires: [INotebookTracker],
  activate: activateMarkdownTest
};


export default markdownTest;