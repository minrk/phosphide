/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  DelegateCommand, ICommand
} from 'phosphor-command';

import {
Message
} from 'phosphor-messaging';

// import {
// BoxPanel
// } from 'phosphor-boxpanel';

import {
  Widget
} from 'phosphor-widget';

import {
  Panel
} from 'phosphor-panel';

import {
  DockPanel
} from 'phosphor-dockpanel';

import {
  ICommandRegistry, ICommandItem
} from '../commandregistry/index';

import {
  Container, Token
} from 'phosphor-di';

import {
  CommandPalette
} from './palette';

import {
  IAppShell
} from '../appshell/index';


/**
 * Resolve the plugin contributions.
 *
 * @param container - The di container for type registration.
 *
 * #### Notes
 * This is automatically called when the plugin is loaded.
 */
 export
 function resolve(container: Container): Promise<void> {
   return container.resolve(CommandPaletteHandler).then(handler => {
     handler.run(container);
   });
 }

export
class CommandPaletteHandler {

  static requires = [IAppShell, ICommandRegistry];

  static create(shell: IAppShell): CommandPaletteHandler {
    return new CommandPaletteHandler(shell);
  }

  constructor(shell: IAppShell) {
    this._shell = shell;
  }

  run(container: Container): void {
    this._palette = new CommandPalette();
    this._palette.title.text = 'Commands';

    container.resolve(ICommandRegistry).then(reg => {
      reg.commandsAdded.connect(this._registryCommandsAdded, this);
      this._commandIds = reg.list();
      this._commandIds.map(x => { this._addToPalette(x); } );
    }).catch(e => { console.log(e); });

    this._shell.addToLeftArea(this._palette, { rank: 40 });
  }

  private _registryCommandsAdded(sender: ICommandRegistry, value: string[]) {
    this._commandIds = this._commandIds.concat(value);
    this._addToPalette(value[0]);
  }

  private _addToPalette(item: string) {
    this._palette.add([{ text: 'From plugins...', items: [{
      id: item,
      title: item,
      caption: item
    }]}]);
  }

  private _shell: IAppShell;
  private _commandIds: string[] = [];
  private _palette: CommandPalette; // TODO - update CommandPalette so we dont
  // need this handle here.
}
