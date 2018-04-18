//========================================================================================
/*                                                                                      *
 * Author: Camilo Talero                                                                *
 *                                                                                      */
//========================================================================================

'use strict';

import * as vscode from 'vscode';
//import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

var maximum = 90;
var sepChar = '#';
var frameChar = '=';
//########################################################################################

//========================================================================================
/*                                                                                      *
 * Activate the extansion commands                                                      *
 *                                                                                      */
//========================================================================================

export function activate(context: vscode.ExtensionContext) {

    console.log('Hermes Comments has started');

    let cFrame = vscode.commands.registerCommand('extension.makeCenteredSection', () => {

        let success = makeCenteredFramedText();

        if(!success)
        {
            vscode.window.showInformationMessage('No text selected');
        }
    });

    let lFrame = vscode.commands.registerCommand('extension.makeLeftSection', () => {

        let success = makeLeftFramedText();

        if(!success)
        {
            vscode.window.showInformationMessage('No text selected');
        }
    });

    let subs = vscode.commands.registerCommand('extension.makeSubSection', () => {

        let success = makeSubsectionText();

        if(!success)
        {
            vscode.window.showInformationMessage('Selection not valid. Subsections must be one line');
        }
    });

    let separator = vscode.commands.registerCommand('extension.makeSeparatorLine', () => {
        makeSeparatorLine();
    });

    context.subscriptions.push(cFrame);
    context.subscriptions.push(lFrame);
    context.subscriptions.push(subs);
    context.subscriptions.push(separator);
}


export function deactivate() {
}
//########################################################################################

//========================================================================================
/*                                                                                      *
 * Text processing functions                                                            *
 *                                                                                      */
//========================================================================================

function makeSubsectionText()
{
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    let currentLineString = editor.document.getText(selection);

    let lines = currentLineString.split('\n');
    if(lines.length>1 || lines.length===0)
    {
        return false;
    }

    let text = currentLineString.trim();

    let title = '//──── ' + text + ' ';
    let gap = title.length;
    for(let index=0; index<(maximum - gap); index++)
    {
        title += '─';
    }

    editor.edit( textEditorEdit => {
        textEditorEdit.replace(
            editor.selection,
            title
        );
    });

    return true;
}

function makeSeparatorLine()
{
    let sep = '//';

    for (let index =0; index < maximum-2; index++)
    {
        sep+=sepChar;
    }

    let editor = vscode.window.activeTextEditor;
    let line = editor.selection.active.line;

    editor.edit( textEditorEdit => {
        textEditorEdit.replace(
            editor.document.lineAt(line).range,
            sep
        );
    });

}

function makeLeftFramedText()
{
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    let currentLineString = editor.document.getText(selection);

    if(currentLineString==='')
    {
        return false;
    }

    let framedText = makeFramingText('=');
    framedText += lJustifyText(currentLineString);
    framedText += makeFramingText('=');

    vscode.window.activeTextEditor.edit( textEditorEdit => {
        textEditorEdit.replace(
            editor.selection,
            framedText
        );
    });

    return true;
}

function makeCenteredFramedText()
{
    let editor = vscode.window.activeTextEditor;
    let selection = editor.selection;
    let currentLineString = editor.document.getText(selection);

    if(currentLineString==='')
    {
        return false;
    }

    let framedText = makeFramingText(frameChar);
    framedText += alignText(currentLineString);
    framedText += makeFramingText(frameChar);

    vscode.window.activeTextEditor.edit( textEditorEdit => {
        textEditorEdit.replace(
            editor.selection,
            framedText
        );
    });

    return true;
}

function lJustifyText(text)
{
    let lines = text.split('\n');
    let resulText = '';

    for(let index=0; index<lines.length; index++)
    {
        let line = lines[index].trim();
        let fill = ' ';

        resulText += ' *'+fill+line;

        fill = makeTrailingWS(maximum-resulText.length-2);

        resulText+=fill+'*\n';
    }
    resulText = '/*' + makeTrailingWS(maximum-4) + '*\n'+resulText +
        ' *' +makeTrailingWS(maximum-4) + '*/\n';
    return resulText;
}

function alignText(text)
{
    let lines = text.split('\n');
    let resulText = '';

    for(let index=0; index<lines.length; index++)
    {
        let line = lines[index].trim();
        let length = line.length;
        let fill = makeTrailingWS((maximum-length)/2 - 2);

        resulText += ' *'+fill+line;
        if(length%2!==0)
        {
            fill = fill.substr(0,fill.length-1);
        }
        resulText+=fill+'*\n';
    }
    resulText = '/*' + makeTrailingWS(maximum-4) + '*\n'+resulText +
        ' *' +makeTrailingWS(maximum-4) + '*/\n';
    return resulText;
}

function makeTrailingWS(tLength)
{
    let trailing = '';
    for(let index=0; index < tLength; index++)
    {
        trailing+=' ';
    }

    return trailing;
}

function makeFramingText(char)
{
    let line = '';
    line += '//';
    for (let index = 0; index < maximum-2; index++)
    {
        line+=char;
    }
    line+='\n';

    return line;
}
//########################################################################################