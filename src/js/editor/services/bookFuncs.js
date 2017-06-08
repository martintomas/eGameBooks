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