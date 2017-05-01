export function buildRenderInfo(renderInfo, actionInfo) {
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