<template>
    <div class='dyn-condition-root'>
        <div class='condition-list'>
            <template v-if="selectedNodes.length > 1">
                <label class="modalLabel">Condition result:</label>
                <ul>
                    <li v-for="(node,index) in selectedNodes">
                        <template v-if="index>0"> <!-- ignore starting node -->
                            <template v-if="selectedNodes.length-1 === index">
                                <dyn-tooltip ref='tooltipCond' :tooltip-id="getHash('modal',index)">
                                    <span @click="showTooltip(index,false)" :component-id="getHash('modal',index)" class='editor-action-buttons actions-cond tooltip cursor' slot='tooltip'>{{node.stringPart}}</span>
                                    <span slot='tooltipText'>
                                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeCond(index)" ></i>
                                    </span>
                                </dyn-tooltip>
                            </template>
                            <template v-else>
                                <span class='editor-action-buttons actions-cond no-cursor'>{{node.stringPart}}</span>
                            </template>
                        </template>
                    </li>
                </ul>
                <template v-if="!isSelectionValid">
                    <i class="fa fa-times-circle wrong-input" aria-hidden="true" ></i>
                </template>
                <template v-else>
                    <i class="fa fa-check right-input" aria-hidden="true" ></i>
                </template>
            </template>
        </div>
        <label for="linkCondition" class="modalLabel">Page show condition:</label>
        <div class='' style="display:inline-block">
            <input class="modalInput whisperer" :component-id="componentId" v-model="conditionTextLocal" ref='condInputRef' type="text" id="linkCondition" @focus='showWhisperer' @input='showWhisperer' @keyup.enter='selectAuto'>
            <div class="whisperer-content" ref="dropdownWhisperer">
                <div class="page-whisperer-scroller" ref="page-whisperer-scroller">
                    <ul>
                        <li v-for="(value,index) in whispererText" @click='selectValue(value)' class='whisperer' :component-id="componentId" >
                            {{value}}
                        </li>
                    </ul>
                </div>
            </div>
            <template v-if="whispererText.length === 0 && !condNode.end">
                <i class="fa fa-times-circle wrong-input" aria-hidden="true" ></i>
            </template>
            <template v-if="condNode.end">
                <i class="fa fa-check right-input" aria-hidden="true" ></i>
            </template>
        </div>
    </div>
</template>

<script>
import IScroll from 'iscroll'
import {bus} from './app.js'
import DynTooltip from './dynTooltip.vue'
import {componentsId} from './dynMixins.js'

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
    isEnd() {
        this.end = true
        return this
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
    buildNodeTree({condString='',result=[this.getStartinResult()]}) {
        condString = condString.trim()
        if(condString === '') {
            return result //string was read complete
        }
        let condStringOne, condStringTemp
        [condStringOne,condStringTemp] = this.getOneNodeDestription(condString) //get complex analysis of provided string

        let condConn = this.findConnForString(condStringOne) //get connection
        if(condConn === null) return null //exists connection --> check if it is valid condition

        if(result.length > 0) result[result.length-1].condConn = condConn
        result.push(CondNode.buildResultNode(condStringOne,condConn.destNode,null) ) //push node to result
        return condConn.destNode.buildNodeTree({condString:condStringTemp,result:result}) //continue building nodes
    }
    isValidString(condString) {
        //check if cond is valid string --> we try to construct full node tree
        let valRes = this.buildNodeTree({condString:condString,validate:true})
        if(valRes === null) return false
        return true
    }
    getConnText() {
        let conText = []
        this.connectionsOut.forEach(conn => {
            if(conn instanceof ComplexCondConnection) {
                conText = conn.names
                return
            }
            conText.push(conn.name)
        })
        return conText.sort()
    }
    getStartinResult() {
        return CondNode.buildResultNode('',this,null)
    }
    static areNodesValid(resultNodes) {
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
    static getStringCondition(nodes) {
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
    static buildResultNode(stringPart,node,condConn) {
        return new ResultCondNode(stringPart,node,condConn)
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
    constructor(name) {
        super()
        this.name = name
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
    constructor(names) {
        super()
        this.names = names
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
        return true
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

let tempNode, startCondNode, tempConn
let connDict = {
    'If': new SimpleCondConnection('If'),
    'you': new SimpleCondConnection('you'),
    'has': new SimpleCondConnection('has'),
    "hasn't": new SimpleCondConnection("hasn't"),
    'ITEMS':new ComplexCondConnection(['sword','armor','hand','dagger','big sword','super mega sword'])
}

startCondNode = new CondNode().addConnectionOut(connDict['If'])

tempNode = new CondNode().addConnectionOut(connDict['you'])
connDict['If'].setDestNode(tempNode)

tempNode = new CondNode().addConnectionOut(connDict['has']).addConnectionOut(connDict["hasn't"])
connDict['you'].setDestNode(tempNode)

tempNode = new CondNode().addConnectionOut(connDict['ITEMS'])
connDict['has'].setDestNode(tempNode)

tempNode = new CondNode().addConnectionOut(connDict['ITEMS'])
connDict["hasn't"].setDestNode(tempNode)

tempNode = new CondNode().isEnd()
connDict['ITEMS'].setDestNode(tempNode)
connDict['ITEMS'].setDestNode(tempNode)

// let condition = 'If you has **sword1**'
// let nodes = startCondNode.buildNodeTree({condString:condition})
// console.log(nodes)
// console.log(CondNode.areNodesValid(nodes))
// console.log(CondNode.getStringCondition(nodes))


export default {
    mixins: [componentsId],
    components: {
        DynTooltip
    },
    props: {
        pageCondition: null,
    },
    data() {
        return {
            startNode: startCondNode,
            condNode: startCondNode,
            scrollWrapper: 'dropdownWhisperer',
            selectedNodes: [startCondNode.getStartinResult()],
            conditionTextLocal: '',
            componentId: this.getHash('dyn-condition',0)
        }
    },
    computed: {
        isSelectionValid() {
            return CondNode.areNodesValid(this.selectedNodes)
        },
        whispererText() {
            let condRes = []
            let condsTemp = this.condNode.getConnText()
            let conditionTextLocal = String(this.conditionTextLocal)

            if(this.scroller) {
                setTimeout(() => {
                            this.scroller.refresh(); //actualize scroller based on new height (changed when new page number is used)
                        }, 200);
            }

            if(conditionTextLocal === '') return condsTemp

            condsTemp.forEach(cond => {
                if (String(cond).substr(0,conditionTextLocal.length) === conditionTextLocal) {
                    condRes.push(cond)
                }
            })
            return condRes
        },
    },
    watch: {
        pageCondition(val) {
            if(this.pageCondition!= '') {
                let tempNodes = this.startNode.buildNodeTree({condString:val})
                if(tempNodes != null) {
                    this.selectedNodes = tempNodes
                    this.condNode = this.selectedNodes[this.selectedNodes.length-1].condNode
                } else {
                     this.clear()
                }
            } else {
                this.clear()
            }
        }
    },
    mounted() {
        this.dropdownWhisperer = this.$refs.dropdownWhisperer
        bus.$on('hide-whisperer', source => {
            if (!source.target.matches('.whisperer')) {
                this.hideWhisperer()
            } else {
                let componentId = source.target.getAttribute('component-id')
                if(componentId && this.componentId != null) {
                    if(componentId != this.componentId) {
                        this.hideWhisperer()
                    }
                }
            }
        })
        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        });
    },
    methods: {
        showWhisperer() {
            if(!this.dropdownWhisperer.classList.contains("show")) {
                console.log('Showing condition whisperer')
                this.dropdownWhisperer.classList.add("show")
                setTimeout(() => { //actualize scroller based on new height (whisperer have to be shown)
                        this.scroller.refresh(); 
                    }, 200);
            }
        },
        hideWhisperer() {
            if(this.dropdownWhisperer.classList.contains("show")) {
                console.log('Hidding condition whisperer')
                this.dropdownWhisperer.classList.remove("show")
            }
        },
        selectValue(value) {
            let conn = this.condNode.findConnForString(value)
            this.addNewValueToSelectedNodes(conn,value)
        },
        selectAuto() {
            if(this.whispererText.length === 1) { //only one is there -> select automatically
                let conn = this.condNode.findConnForString(this.whispererText[0])
                this.addNewValueToSelectedNodes(conn,this.whispererText[0])
            }
        },
        addNewValueToSelectedNodes(conn,value) {
            if(conn === null) {
                console.log('Automatically filled condition is null --> this shoudl never happen!!!')
                return
            }
            if(this.selectedNodes.length > 0) this.selectedNodes[this.selectedNodes.length-1].condConn = conn
            this.selectedNodes.push(CondNode.buildResultNode(value,conn.destNode,null))
            this.condNode = conn.destNode
            this.conditionTextLocal = ''
            this.$nextTick(() => {
                this.$refs.condInputRef.focus()
            })
        },
        removeCond(index) {
            this.selectedNodes.splice(index, 1); //remove node
            if(this.selectedNodes.length > 0) this.condNode = this.selectedNodes[this.selectedNodes.length-1].condNode //get previous node
            else this.condNode = this.startNode //if there is not previous node, use start
            this.conditionTextLocal = ''
            this.$nextTick(() => {
                this.$refs.condInputRef.focus()
            })
        },
        getDynConditionText() {
            return CondNode.getStringCondition(this.selectedNodes)
        },
        showTooltip(indexData,showSecond) {
            //indexData is not important because we always show only last (one) tooltip
            if(showSecond) {
                 this.$refs.tooltipCond[0].hide()
            }
            this.$refs.tooltipCond[0].show(showSecond)
        },
        clear() {
            this.selectedNodes = [this.startNode.getStartinResult()]
            this.condNode = this.startNode
            this.conditionTextLocal = ''
        }
    }
}

</script>

<style>
.dyn-condition-root {
    display:inline-block;
}
.condition-list {
    margin-top:0.5rem;
    width:100%;
}
.condition-list ul {
  list-style-type: none;
  display:inline;
  padding-left:0px;
  overflow:auto;
}
.condition-list li {
  display:inline-block;
}
.actions-cond {
    border: 1px solid #FFCC99;
    background-color:#FFCC99;
}
.wrong-input {
    color:red;
    font-size:150%;
    margin-left:0.5rem;
}
.right-input {
    color:green;
    font-size:150%;
    margin-left:0.5rem;
}
</style>