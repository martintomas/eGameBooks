import {AllowedActions,ErrorImportance} from 'editor/constants'

export function containsErrors(res,severinity=null) {
    if(severinity === null) {
        if(res[ErrorImportance.MINOR].length > 0) return true
        if(res[ErrorImportance.SEVERE].length > 0) return true
    } else {
        if(res[severinity].length > 0) return true
    }
    return false
}

export function isRenderedActionCorrect(state,page,actionType,renderedActionId,res=null) {
    if(res === null) {
        res = {}
        res[ErrorImportance.MINOR] = []
        res[ErrorImportance.SEVERE] = []
    }

    if(!page.renderInfo[actionType][renderedActionId].exist) {
        res[ErrorImportance.SEVERE].push({text:'missing-action-validation',args:[actionType,renderedActionId]})
    } else { //action exists
        let action = page.actions[actionType][renderedActionId]
        isActionCorrect(actionType,action,res)
    }

    return res
}

export function isActionCorrect(actionType,action,res=null) {
    if(res === null) {
        res = {}
        res[ErrorImportance.MINOR] = []
        res[ErrorImportance.SEVERE] = []
    }

    if(actionType === AllowedActions.LINK) { //do link specific validation
        if(action.pageId === null) res[ErrorImportance.SEVERE].push({text:'missing-link-pageid-validation',args:[action.id]})
        //if(action.condition) //do condition check in future !!!!
    } else if(actionType === AllowedActions.ITEM) {
        if(action.ref === null) res[ErrorImportance.SEVERE].push({text:'missing-item-actionid-validation',args:[action.id]})
    }

    return res
}

export function isPageCorrect(state,page,actionType) { //checks only page inner data
    let res = {}
    res[ErrorImportance.MINOR] = []
    res[ErrorImportance.SEVERE] = []
    //check that all actions are defined
    for(let key in page.renderInfo) {
        if (actionType === null || actionType === key) { //key exist in actionType
            for (let id in page.renderInfo[key]) {
                isRenderedActionCorrect(state,page,key,id,res)
            }
        }
    }

    if(state.startPage != page.data.id) { //is not start page --> have to have some reverse pages
        if(page.reverseLink.length === 0) res[ErrorImportance.MINOR].push({text:'no-reverse-pages-validation',args:[]})
    }

    return res
}


