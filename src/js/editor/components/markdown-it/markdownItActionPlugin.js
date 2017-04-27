// Process custom inline actions
//
'use strict';

var ActionString = require('editor/components/markdown-it/actionStrings')

function getActionValues(actionData, pageId) {
    var actionValues = { 'actionType': null, 'actionId': null, 'actionText': null }

    var values = actionData.trim().split(':')
    if (values.lenght < 3) return actionValues

    actionValues['actionType'] = values[0]
    actionValues['actionId'] = Number(values[1])
    actionValues['actionText'] = values.slice(2).join(':') //connect text together
    actionValues['pageId'] = pageId
    return actionValues
}

function validateAction(actionData, allowedActionsRef, actionsRef) {
    if (!actionData['actionType'] in allowedActionsRef || actionData['actionType'] === null || actionData['actionType'] === '') return false
    if (!Number.isInteger(actionData['actionId']) || actionData['actionId'] <= 0) return false

    if (!actionData['actionType'] in allowedActionsRef) return false //check that allowed action exists in dict

    //store action analysis --> so we know number of actions, their id, text, etc.
    if (actionData['actionType'] in actionsRef) {
        actionsRef[actionData['actionType']].push({ 'id': actionData['actionId'], 'text': actionData['actionText'] })
    } else {
        actionsRef[actionData['actionType']] = [{ 'id': actionData['actionId'], 'text': actionData['actionText'] }]
    }

    return true
}

function renderActionOpen(tokens, idx, options, env, slf) {
    return ActionString.getMarkdownString('open',tokens[idx].meta.actionType, [
        tokens[idx].meta.actionId,
        tokens[idx].meta.pageId,
        tokens[idx].meta.actionId
    ])
}

function renderActionClose(tokens, idx, options, env, slf) {
    return ActionString.getMarkdownString('close',tokens[idx].meta.actionType, null)
}

module.exports = function actionPlugin(md, options) {

    md.renderer.rules.actionOpen = renderActionOpen;
    md.renderer.rules.actionClose = renderActionClose;

    var markerString = ':',
        markerChar = markerString.charCodeAt(0),
        markerLength = 3,
        allowedActionsRef = options.allowedActions

    //action field function
    function actionInline(state, silent) {
        var pos, posEnd, markup, params, token, tokens, endMarkNum, actionData,
            max = state.posMax,
            start = state.pos;

        // Check out the first character quickly,
        // this should filter out most of inline actions
        if (markerChar !== state.src.charCodeAt(start)) { return false; }

        // Check out the rest of the marker string (start)
        for (pos = start + 1; pos < start + markerLength; pos++) { //check if marker is complete for all length
            if (markerChar !== state.src.charCodeAt(pos)) { //marker is wrong
                { return false; }
            }
        }

        //find end mark --> required
        for (posEnd = pos; posEnd <= max; posEnd++) {
            if (markerChar !== state.src.charCodeAt(posEnd)) { //marker is wrong
                endMarkNum = 0
            } else {
                endMarkNum += 1
                if (endMarkNum === markerLength) break;
            }
        }
        if (endMarkNum !== markerLength) { return false; } //was marker end found?

        markup = state.src.slice(start, pos); //remmember markup
        //posEnd += 1 //move after first markup
        params = state.src.slice(pos, posEnd - markerLength + 1); //remmember values after markup

        actionData = getActionValues(params, state.env['pageId']) //get individual parts of action

        if (!validateAction(actionData, allowedActionsRef, state.env['analysis'])) { return false; } //validate params --> used provided function

        if (silent) { return false; }

        token = state.push('actionOpen', '', 1); //open action
        token.meta = actionData

        state.md.inline.parse( //parse inline for other rules
            actionData['actionText'],
            state.md,
            state.env,
            tokens = []
        );

        for (let i = 0; i < tokens.length; i++) { //add new tokens for processsing
            state.tokens.push(tokens[i])
        }

        token = state.push('actionClose', '', -1); //close action
        token.meta = actionData

        //move state position
        state.pos = posEnd + 1;
        state.posMax = max;
        return true;
    }

    md.inline.ruler.before('emphasis', 'actionInline', actionInline);
};