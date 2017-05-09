import {AllowedActions,ErrorImportance} from 'editor/constants'

export function isRenderedActionCorrect(state,page,actionType,renderedActionId,res={}) {
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

export function isPageCorrect(state,page) { //checks only page inner data
    let res = {}
    res[ErrorImportance.MINOR] = []
    res[ErrorImportance.SEVERE] = []
    //check that all actions are defined
    for(let key in page.renderInfo) {
        if (key in page.renderInfo) { //key exist in actions
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


