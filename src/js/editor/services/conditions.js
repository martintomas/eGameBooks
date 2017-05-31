import {AllowedActions} from 'editor/constants'
import Vue from 'vue'

class CondNode {
    constructor() {
        this.connectionsOut = []
        this.end = false
    }
    addConnectionOut(connection) {
        let isValid = true
        this.connectionsOut.forEach(conn => {
            if(conn instanceof ComplexCondConnection) {
                console.log('Complex condition can be only one per node')
                isValid = false
                return
            }
        })
        if(connection instanceof ComplexCondConnection && this.connectionsOut.length > 0) {
            console.log('Complex condition can be only one per node')
            isValid = false
        }
        if(isValid) this.connectionsOut.push(connection)
        return this
    }
    removeConnectionsOut() {
        this.connectionsOut = []
    }
    isEnd() {
        this.end = true
        return this
    }
    findConnForString(condString,strict) {
        ///try to find appropriate connection for provided string name
        let condNode = null
        this.connectionsOut.forEach(conn => {
            if(strict) {
                if(conn.containsNameStrict(condString)) {
                    condNode = conn
                    return
                }
            }
            if(conn.containsName(condString)) {
                condNode = conn
                return
            }
        })
        return condNode
    }
    getConnText(usedModules = []) {
        let conText = [], i, valid
        this.connectionsOut.forEach(conn => {
            valid = false
            for(i=0;i<conn.condTypes.length;i++) {
                if(usedModules.indexOf(conn.condTypes[i]) >= 0) { //at least one used modules has to be in condTypes of condition
                    valid = true
                    break
                }     
            }
            if(valid) {
                if(conn instanceof ComplexCondConnection) {
                    conText = conn.names
                    return
                }
                conText.push(conn.name)
            }
        })
        return conText.sort()
    }
}

class CondConnection {
    constructor() {
        this.destNode = null
    }
    setDestNode(node) {
        this.destNode = node
    }
}

class SimpleCondConnection extends CondConnection {
    constructor(name,condTypes) {
        super()
        this.name = name
        this.condTypes = condTypes
    }
    containsNameStrict(name) {
        return this.containsName(name)
    }
    containsName(name) {
        return (name === this.name)
    }
    getString(name) {
        return name
    }
}

class ComplexCondConnection extends CondConnection {
    constructor(names,condTypes) {
        super()
        this.names = names
        this.condTypes = condTypes
    }
    containsNameStrict(name) {
        let containsName = false
        this.names.forEach(nam => {
            if(nam === name) {
                containsName = true
                return
            }
        })
        return containsName
    }
    containsName(name) { //don't do strict validation, complex cond connections can often change
        for(let i=0;i<this.names.length;i++) {
            if(name === this.names[i]) return true
        }
        return false
    }
    getString(name) {
        return '**'+name+'**'
    }
}

class ResultCondNode {
    constructor(stringPart,condNode,condConn) {
        this.stringPart = stringPart
        this.condNode = condNode
        this.condConn = condConn
    }
}

class ConditionGraph {
    constructor() {
        this.connDict = {
            'If': new SimpleCondConnection('If',[AllowedActions.ITEM]),
            'you': new SimpleCondConnection('you',[AllowedActions.ITEM]),
            'has': new SimpleCondConnection('has',[AllowedActions.ITEM]),
            "hasn't": new SimpleCondConnection("hasn't",[AllowedActions.ITEM]),
        }
        this.connDict[AllowedActions.ITEM] = new ComplexCondConnection([],[AllowedActions.ITEM]) //will be updated later on

        this.startNode = new CondNode().isEnd()
        this.commit = null
    }
    initializeConditionGraph(commit) {
        let tempNode, tempConn

        this.commit = commit

        this.startNode.addConnectionOut(this.connDict['If'])

        tempNode = new CondNode().addConnectionOut(this.connDict['you'])
        this.connDict['If'].setDestNode(tempNode)

        tempNode = new CondNode().addConnectionOut(this.connDict['has']).addConnectionOut(this.connDict["hasn't"])
        this.connDict['you'].setDestNode(tempNode)

        tempNode = new CondNode().addConnectionOut(this.connDict[AllowedActions.ITEM])
        this.connDict['has'].setDestNode(tempNode)

        tempNode = new CondNode().addConnectionOut(this.connDict[AllowedActions.ITEM])
        this.connDict["hasn't"].setDestNode(tempNode)

        tempNode = new CondNode().isEnd()
        this.connDict[AllowedActions.ITEM].setDestNode(tempNode)
        this.connDict[AllowedActions.ITEM].setDestNode(tempNode)

    }
    updatedComplexConnections(nodeType,newValues=[]) {
        if(nodeType in this.connDict) {
            this.connDict[nodeType].names = newValues
        } else {
            console.log('Cond node of type '+nodeType+' doesnt exists')
        }
    }
    removeCompexConnection(nodeType,newValue) {
        let key
        if(nodeType in this.connDict) {
            key = this.connDict[nodeType].names.indexOf(newValue)
            if(key >= 0) Vue.delete(this.connDict[nodeType].names,key)
        } else {
            console.log('Cond node of type '+nodeType+' doesnt exists')
        }
    }
    addCompexConnection(nodeType,newValue) {
        if(nodeType in this.connDict) {
            this.connDict[nodeType].names.push(newValue)
        } else {
            console.log('Cond node of type '+nodeType+' doesnt exists')
        }
    }
    getOneNodeDestription(condString) {
        //find string description -> one word for connection names and **multi** word for node names
        let condTempString = null
        if(condString.substr(0,2) === '**') { //check if it is dynamic (node string)
            condTempString = condString.split('**')
            if(condTempString.length > 2) { //check if end exists
                return [condTempString[1],condTempString.slice(3).join('**')]
            } 
        }
        condTempString = condString.split(' ')
        return [condTempString[0],condTempString.slice(1).join(' ')]
    }
    buildNodeTree(condString='',result=[this.getStartingResult()]) {
        condString = condString.trim()
        if(condString === '') {
            return result //string was read complete
        }
        let condStringOne, condStringTemp
        [condStringOne,condStringTemp] = this.getOneNodeDestription(condString) //get complex analysis of provided string

        let condConn = result[result.length-1].condConn.findConnForString(condStringOne) //get connection
        if(condConn === null) return null //exists connection --> check if it is valid condition

        if(result.length > 0) result[result.length-1].condConn = condConn
        result.push(this.buildResultNode(condStringOne,condConn.destNode,null) ) //push node to result
        return this.buildNodeTree({condString:condStringTemp,result:result}) //continue building nodes
    }
    isValidString(condString) {
        //check if cond is valid string --> we try to construct full node tree
        let valRes = this.buildNodeTree(condString)
        if(valRes === null) return false
        return true
    }
    getStartingResult() {
        return this.buildResultNode('',this.startNode,null)
    }
    areNodesValid(resultNodes) {
        //check is provided node tree is valid (we know that connections are ok, so we check just names)
        console.log('running strict validation of condition')
        let isValid = true
        let previousNode = null
        resultNodes.forEach(node => {
            if(previousNode === null) {
                previousNode = node
            } else {
                if(previousNode.condNode.findConnForString(node.stringPart,true) === null) { //compare agains previous, because we store data in forward direction
                    isValid = false
                    return
                }
                if(node === resultNodes[resultNodes.length-1]) { //last node have to have end param
                    if(!node.condNode.end) {
                        isValid = false
                    }
                }
                previousNode = node
            }
        })
        return isValid
    }
    getStringCondition(nodes) {
        //build back string from cond nodes
        let tempString = ''
        let previousNode = null
        nodes.forEach(node => {
            if(previousNode === null) {
                previousNode = node
                tempString += node.stringPart
            } else {
                tempString += ' ' +previousNode.condConn.getString(node.stringPart)
                previousNode = node
            }
        })
        return tempString.trim()
    }
    buildResultNode(stringPart,node,condConn) {
        return new ResultCondNode(stringPart,node,condConn)
    }
}

export default ConditionGraph