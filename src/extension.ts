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
var headChar = '+';
var fillChar = ' ';
//########################################################################################

//========================================================================================
/*                                                                                      *
 * Activate the extension commands                                                      *
 *                                                                                      */
//========================================================================================

export function activate(context: vscode.ExtensionContext) {

    console.log('Hermes Comments has started');

    let cFrame = vscode.commands.registerCommand('extension.makeCenteredSection', () => {

        getSettings();

        let success = makeCenteredFramedText();

        if(!success)
        {
            vscode.window.showInformationMessage('No text selected');
        }
    });

    let lFrame = vscode.commands.registerCommand('extension.makeLeftSection', () => {
        getSettings();

        let success = makeLeftFramedText();

        if(!success)
        {
            vscode.window.showInformationMessage('No text selected');
        }
    });

    let subs = vscode.commands.registerCommand('extension.makeSubSection', () => {
        getSettings();

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

function getSettings()
{
    const config = vscode.workspace.getConfiguration('hermes-comments');

    if(config.has('maximum'))
    {
        maximum = config.get('maximum');
    }
    if(config.has('frame'))
    {
        frameChar = config.get('frame');
    }
    if(config.has('title'))
    {
        headChar = config.get('title');
    }
    if(config.has('separator'))
    {
        sepChar = config.get('separator');
    }
    if(config.has('fill'))
    {
        fillChar = config.get('fill');
    }
}

function cleanText(text)
{
    var lines = text.split('\n');

    var result = '';

    var end = lines[lines.length-1] === ''? lines.length-1: lines.length;
    for(var i=0; i<end; i++)
    {
        result += cleanLine(lines[i]);
    }

    if(result.charAt(result.length-1)==='\n')
    {
        result = result.substr(0,result.length-1);
    }
    return result;
}
function cleanLine(line)
{
    line = line.trim();
    var nLine = '\n';
    if(line.includes('*/'))
    {
        line = '';
        nLine = '';
    }
    if(line.includes('/**'))
    {
        line = '';
        nLine = '';
    }  
    else if(line.includes('/*'))
    {
        line = '';
        nLine = '';
    }
    else if(line.substr(0,1)==='*')
    {
        line = line.substr(1,line.length-1);
    }

    if(line.substr(line.length-1)==='*')
    {
        line = line.substr(0,line.length-2);
    }

    if(line.includes('//'+headChar+headChar) || line.includes('//'+frameChar+frameChar))
    {
        line = '';
        nLine = '';
    }

    return line + nLine;
}

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
    
    var frame = frameChar;
    if(currentLineString.includes('author'))
    {
        frame = headChar;
    }

    let framedText = makeFramingText(frame);
    framedText += lJustifyText(currentLineString);
    framedText += makeFramingText(frame);

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

    var frame = frameChar;
    if(currentLineString.includes('author'))
    {
        frame = headChar;
    }

    let framedText = makeFramingText(frame);
    framedText += alignText(currentLineString);
    framedText += makeFramingText(frame);

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
    var extra = '';
    if(text.includes('/**'))
    {
        extra = '*';
    }
    text = cleanText(text);
    let lines = text.split('\n');
    let resulText = '';

    for(let index=0; index<lines.length; index++)
    {
        let line = lines[index].trim();

        let fill = ' ';

        var nLine = ' *'+fill+line;
        resulText += nLine;

        fill = makeTrailingWS(maximum-nLine.length-2);

        resulText+=fill+'*\n';
    }
    resulText = '/*'+ extra + makeTrailingWS(maximum-4 - extra.length) + '*\n'+resulText +
        ' *' +makeTrailingWS(maximum-4) + '*/\n';
    return resulText;
}

function alignText(text)
{
    var extra = '';
    if(text.includes('/**'))
    {
        extra = '*';
    }
    text = cleanText(text);
    let lines = text.split('\n');
    let resulText = '';

    for(let index=0; index<lines.length; index++)
    {
        let line = lines[index].trim();
        if(lines[index]==='')
        {
            line = ' ';
        }
        let length = line.length;
        let fill = makeTrailingWS((maximum-length)/2 - 2);

        resulText += ' *'+fill+line;
        if(length%2!==0)
        {
            fill = fill.substr(0,fill.length-1);
        }
        resulText+=fill+'*\n';
    }
    resulText = '/*'+extra + makeTrailingWS(maximum-4-extra.length) + '*\n'+resulText +
        ' *' +makeTrailingWS(maximum-4) + '*/\n';
    return resulText;
}

function makeTrailingWS(tLength)
{
    let trailing = '';
    for(let index=0; index < tLength; index++)
    {
        trailing+=fillChar;
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