var ActionString = require('editor/components/markdown-it/actionStrings')

class EditorTextActions {
    constructor() {}
    getActionHtmlString(action,args) {
        switch (action) {
            case 'link':
                return "<page-text-action-link :page-data='pageData' :render-type='renderType' :actionId='{0}' text='{1}'></page-text-action-link>".format(args)
        }
        return ''
    }
}

class PageHtmlEditorParser {
    constructor() {
        this.parsedActions = ['link']
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


    //     let indexes = [] //shortcut to help me navigate what is where
    //     let res = [] //found action + text

    //     //initialize indexes structure
    //     for(let i=0;i<this.pageText.length;i++) {
    //         indexes[i] = 0
    //     }
    //     //initialize text field
    //     res[0] = {'type':'text','value':this.pageText}
    //     for(let i=0;i<this.parsedActions.length;i++) {
    //         let actionReg = ActionString.getRegexString(this.parsedActions[i])
    //         let result = null
    //         while ((result = actionReg.exec(this.pageText))) {
    //             //several result are obtained, namely it is
    //             //1 action id
    //             //2 page id - action - id
    //             //3 text

    //             res.push({ //save result
    //                 'type':this.parsedActions[i],
    //                 'actionId':result[1],
    //                 'pageId':this.pageData.data.id,
    //                 'value':result[3]
    //             })
    //             //update indexes --> so we know where is this type of action
    //             for(let j=result.index;j<result.index+result[0].length;j++) {
    //                 indexes[j] = res.length-1
    //             }
    //         }
    //     }

    //     //we have all action types and their position -> no build simple array that is usable for template
    //     let finRes = [], prevIndex = null, indexLength = 0
    //     for(let i=0;i<indexes.length;i++) {
    //         if(prevIndex === null) prevIndex = indexes[i]
    //         else if(indexes[i] != prevIndex || i === indexes.length - 1) { //add only new info
    //             if(prevIndex === 0) { //previous tag was text
    //                 finRes.push({
    //                     'type':res[0].type,
    //                     'value':res[0].value.substring(0,indexLength)
    //                 })
    //                 res[0].value = res[0].value.substring(indexLength) //shorten text string
    //             } else { //action is provided
    //                 //console.log(res[indexes[i]])
    //                 finRes.push(res[prevIndex])
    //                 res[0].value = res[0].value.substring(indexLength) //shorten text string
    //             }
    //             indexLength = 0
    //         }
    //         prevIndex = indexes[i]
    //         indexLength += 1
    //     }
    //     return finRes
    }
}

export default PageHtmlEditorParser