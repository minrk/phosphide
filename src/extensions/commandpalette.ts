/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2016, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  CommandPalette
} from 'phosphor-commandpalette';

import {
  Application
} from '../core/application';


/**
 * The default commmand palette extension.
 */
export
const commandPaletteExtension = {
  id: 'phosphide.extensions.commandPalette',
  activate: activateCommandPalette
};


/**
 *
 */
function activateCommandPalette(app: Application): Promise<void> {
  let widget = new CommandPalette();
  widget.id = 'command-palette';
  widget.title.text = 'Commands';
  widget.model = app.palette.model;

  app.commands.add([
    { id: 'command-palette:toggle', handler: togglePalette },
    { id: 'command-palette:activate', handler: activatePalette },
    { id: 'command-palette:hide', handler: hidePalette }
  ]);

  app.palette.commandTriggered.connect(() => {
    app.commands.execute('command-palette:hide');
  });

  app.shell.addToLeftArea(widget);

  return Promise.resolve<void>();

  function activatePalette(): void {
    app.shell.activateLeft(widget.id);
    widget.inputNode.focus();
    widget.inputNode.select();
  }

  function hidePalette(): void {
    if (!widget.isHidden) app.shell.collapseLeft();
  }

  function togglePalette(): void {
    if (widget.isHidden) {
      activatePalette();
    } else {
      hidePalette();
    }
  }
}
