import Vue from 'vue'
import {AllowedActions,ErrorImportance} from 'editor/constants'

export function buildRenderInfo(renderInfo, actionInfo) { //even validation is done
    var res = {}
    for (let key in renderInfo) { //go through action types
        if (!(key in res)) res[key] = {} //prepare array for storing data

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
                Vue.set(res[key],renderInfo[key][i].id,{ 'id': renderInfo[key][i].id, 'exist': isValid })
            }
        } else { //key is completely missing in actionInfo
            for (i = 0; i < renderInfo[key].length; i++) {
                Vue.set(res[key],renderInfo[key][i].id,{ 'id': renderInfo[key][i].id, 'exist': false })
            }
        }
    }
    return res
}

export function isRenderedActionCorrect(page,actionType,renderedActionId,res={}) {
    if(!page.renderInfo[actionType][renderedActionId].exist) {
        res[ErrorImportance.SEVERE].push({text:'missing-action-validation',args:[actionType,renderedActionId]})
    } else { //action exists
        let action = page.actions[actionType][renderedActionId]
        if(actionType === AllowedActions.LINK) { //do link specific validation
            if(action.pageId === null) res[ErrorImportance.SEVERE].push({text:'missing-link-pageid-validation',args:[renderedActionId]})
            //if(action.condition) //do condition check in future !!!!
        }
    }
    for(let key in res) { //check if some error was found
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
            for (let id in page.renderInfo[key]) {
                isRenderedActionCorrect(page,key,id,res)
            }
        }
    }
    return res
}