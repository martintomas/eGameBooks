import {AllowedActions,ErrorImportance} from 'editor/constants'

export function buildRenderInfo(renderInfo, actionInfo) { //even validation is done
    var res = {}
    for (let key in renderInfo) { //go through action types
        if (!(key in res)) res[key] = [] //prepare array for storing data

        let i, j, isValid
        if (key in actionInfo) { //key exist in actions
            for (i = 0; i < renderInfo[key].length; i++) {
                isValid = false
                for (let j = 0; j < actionInfo[key].length; j++) {
                    if (renderInfo[key][i].id === actionInfo[key][j].id) { //appropriate action for rendered action exists
                        actionInfo[key][j].existsInText = true
                        isValid = true
                        break
                    }
                }
                res[key].push({ 'id': renderInfo[key][i].id, 'exist': isValid })
            }
        } else { //key is completely missing in actionInfo
            for (i = 0; i < renderInfo[key].length; i++) {
                res[key].push({ 'id': renderInfo[key][i].id, 'exist': false })
            }
        }
    }
    return res
}

export function getAction(actions,key,id) {
    for (let i = 0; i < actions[key].length; i++) {
        if(actions[key][i].id === id) return actions[key][i]
    }
    return null
}

export function isRenderedActionCorrect(page,actionType,renderedActionId,res={}) {
    if(!page.renderInfo[actionType][renderedActionId].exist) {
        res[ErrorImportance.SEVERE].push({text:'missing-action-validation',args:[actionType,page.renderInfo[actionType][renderedActionId].id]})
    } else { //action exists
        let action = getAction(page.actions,actionType,page.renderInfo[actionType][renderedActionId].id)
        if(actionType === AllowedActions.LINK) { //do link specific validation
            if(action.pageId === null) res[ErrorImportance.SEVERE].push({text:'missing-link-pageid-validation',args:[page.renderInfo[actionType][renderedActionId].id]})
            //if(action.condition) //do condition check in future !!!!
        }
    }
    for(let key in res) {
        return false
    }
    return true
}

export function isPageCorrectComplete(state,page) { //checks page outter data --> dependend on other pages
    let res = {}
    res[ErrorImportance.MINOR] = []
    res[ErrorImportance.SEVERE] = []

    if(state.startPage != page.data.id) { //is not start page --> have to have some reverse pages
        if(page.reverseLink.length === 0) res[ErrorImportance.MINOR].push({text:'no-reverse-pages-validation',args:[]})
    }

    return res
}

export function isPageCorrect(state,page) { //checks only page inner data
    let res = {}
    res[ErrorImportance.MINOR] = []
    res[ErrorImportance.SEVERE] = []
    //check that all actions are defined
    for(let key in page.renderInfo) {
        if (key in page.renderInfo) { //key exist in actions
            for (let i = 0; i < page.renderInfo[key].length; i++) {
                isRenderedActionCorrect(page,key,i,res)
            }
        }
    }
    return res
}