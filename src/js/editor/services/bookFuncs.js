import Vue from 'vue'

export function buildRenderInfo(renderInfo, actionInfo) { //even validation is done
    let key,i,j, res = {}
    for(key in actionInfo) {
        for (j in actionInfo[key]) {
            Vue.set(actionInfo[key][j],'existsInText',false) //set to default false value 
        }
    }

    for (key in renderInfo) { //go through action types
        if (!(key in res)) res[key] = {} //prepare array for storing data

        if (key in actionInfo) { //key exist in actions
            for (i = 0; i < renderInfo[key].length; i++) {
                if(renderInfo[key][i].id in actionInfo[key]) {
                    Vue.set(actionInfo[key][renderInfo[key][i].id],'existsInText',true)
                    Vue.set(res[key],renderInfo[key][i].id,{ 'id': renderInfo[key][i].id, 'exist': true })
                } else {
                    Vue.set(res[key],renderInfo[key][i].id,{ 'id': renderInfo[key][i].id, 'exist': false })
                }
            }
        } else { //key is completely missing in actionInfo
            for (i = 0; i < renderInfo[key].length; i++) {
                Vue.set(res[key],renderInfo[key][i].id,{ 'id': renderInfo[key][i].id, 'exist': false })
            }
        }
    }
    return res
}

export function getPageJson(page) {
    let res = {
        id: page.data.id,
        pageNumber: page.data.pageNumber,
        pageType: page.data.pageType,
        pageTittle: page.data.pageTittle,
        text: page.data.text,
    }
    return getJsonPageActions(page,res)
}

export function getJsonPageActions(page,res={}) { //return json response for one page
    let key,key2,key3,i
    res.actions = {}
    for(key in page.actions) {
        i=0
        res.actions[key] = []
        for(key2 in page.actions[key]) {
            res.actions[key].push({})
            for(key3 in page.actions[key][key2]) {
                if(key3 != 'existsInText') {
                    res.actions[key][i][key3] = page.actions[key][key2][key3]
                }
            }
            i++
        }
    }
    return res
}