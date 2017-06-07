var ActionString = require('editor/services/markdown-it/actionStrings')
import {AllowedActions} from 'editor/constants'

class EditorTextActions {
    constructor() {}
    getActionHtmlString(action,args) {
        switch (action) {
            case AllowedActions.LINK:
                return "<page-text-action-link :page-data='pageData' :render-type='renderType' :actionId='{0}' text='{1}'></page-text-action-link>".format(args)
            case AllowedActions.ITEM:
                return "<page-text-action-item :page-data='pageData' :render-type='renderType' :actionId='{0}' text='{1}'></page-text-action-item>".format(args)
        }
        return ''
    }
}

class PageHtmlEditorParser {
    constructor() {
        this.parsedActions = [AllowedActions.LINK,AllowedActions.ITEM]
        this.editorTextActions = new EditorTextActions()
    }
    parseHtmlText(pageText) {
        let result = pageText
        for(let i=0;i<this.parsedActions.length;i++) {
            let actionReg = ActionString.getRegexString(this.parsedActions[i])
            
            result = result.replace(actionReg, (match, actionId, actionDest,text) => {
                return this.editorTextActions.getActionHtmlString(this.parsedActions[i],[actionId,text])
            })
        }
        return result
    }
}

export default PageHtmlEditorParser