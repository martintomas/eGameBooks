<template>
    <div class='markdown-dyn-condition-root'>
            <template v-if="selectedNodes.length > 1">

                <ul class='modalLabel'>
                    <li v-for="(node,index) in selectedNodes">
                        <template v-if="index>0"> <!-- ignore starting node -->
                            <template v-if="selectedNodes.length-1 === index"> <!-- last node -->
                                <dyn-tooltip ref='tooltipCond' :tooltip-id="generateHash('cond-modal',index)" :reactToHover='false' :reactToClick='true'>
                                    <span :component-id="generateHash('cond-modal',index)" class='markdown-action-buttons markdown-actions-cond tooltip cursor' slot='tooltip'>{{node.stringPart}}</span>
                                    <span slot='tooltipText'>
                                        <i class="fa fa-times-circle unactive-icon" aria-hidden="true" @click="removeCond(index,$event)" ></i>
                                    </span>
                                </dyn-tooltip>
                            </template>
                            <template v-else>
                                <span class='markdown-action-buttons markdown-actions-cond no-cursor'>{{node.stringPart}}</span>
                            </template>
                        </template>
                    </li>
                </ul>
                <template v-if="!isSelectionValid">
                    <i class="fa fa-times-circle markdown-condition-wrong-input" aria-hidden="true" ></i>
                </template>
                <template v-else>
                    <i class="fa fa-check markdown-condition-right-input" aria-hidden="true" ></i>
                </template>
                <br>
            </template>
        <label for="linkCondition" class="modalLabel text-left">Page show condition:</label>
        <div class='' style="display:inline-block">
            <input class="modalInput whisperer" :component-id="componentId" v-model="conditionTextLocal" ref='condInputRef' type="text" id="linkCondition" @focus='showWhisperer' @input='showWhisperer' @keyup.enter='selectAuto'>
            <div class="markdown-condition-whisperer-content" ref="dropdownWhisperer">
                <div class="markdown-condition-whisperer-scroller" ref="pageWhispererScroller">
                    <ul>
                        <li v-for="(value,index) in whispererText" @click='selectValue(value)' class='whisperer' :component-id="componentId" >
                            {{value}}
                        </li>
                    </ul>
                </div>
            </div>
            <template v-if="whispererText.length === 0 && !condNode.end">
                <i class="fa fa-times-circle markdown-condition-wrong-input" aria-hidden="true" ></i>
            </template>
            <template v-if="condNode.end">
                <i class="fa fa-check markdown-condition-right-input" aria-hidden="true" ></i>
            </template>
        </div>
    </div>
</template>

<script>
import IScroll from 'iscroll'
import {bus} from 'app.js'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import {generateHash} from 'defaults'
import {editorConditionGraph} from 'editor/services/defaults'

export default {
    components: {
        DynTooltip
    },
    props: {
        pageCondition: null,
    },
    data() {
        return {
            startNode: editorConditionGraph.startNode,
            condNode: editorConditionGraph.startNode,
            scrollWrapper: 'dropdownWhisperer',
            selectedNodes: [editorConditionGraph.getStartingResult()],
            conditionTextLocal: '',
            componentId: this.generateHash('dyn-condition',0)
        }
    },
    computed: {
        usedModules() {
            return this.$store.state.editor.bookData.mainInfo.usedModules
        },
        isSelectionValid() {
            return editorConditionGraph.areNodesValid(this.selectedNodes)
        },
        whispererText() {
            let condRes = []
            let condsTemp = this.condNode.getConnText(this.usedModules)
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
        pageCondition(value) {
            if(value != '') {
                let validRes, res
                [validRes,res] = editorConditionGraph.buildNodeTree(value)
                if(res != null) {
                    this.selectedNodes = res
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
        bus.$on('automatic-hide', source => {
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
        generateHash,
        showWhisperer() {
            if(!this.dropdownWhisperer.classList.contains("show-block")) {
                //console.log('Showing condition whisperer')
                this.dropdownWhisperer.classList.add("show-block")
                setTimeout(() => { //actualize scroller based on new height (whisperer have to be shown)
                    this.scroller.refresh(); 
                }, 200);
            }
        },
        hideWhisperer() {
            if(this.dropdownWhisperer.classList.contains("show-block")) {
                //console.log('Hidding condition whisperer')
                this.dropdownWhisperer.classList.remove("show-block")
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
                console.log('Automatically filled condition is null --> this should never happen!!!')
                return
            }
            if(this.selectedNodes.length > 0) this.selectedNodes[this.selectedNodes.length-1].condConn = conn
            this.selectedNodes.push(editorConditionGraph.buildResultNode(value,conn.destNode,null))
            this.condNode = conn.destNode
            this.conditionTextLocal = ''
            this.$nextTick(() => {
                this.$refs.condInputRef.focus()
            })
        },
        removeCond(index,event) {
            if (event) event.stopPropagation()

            this.selectedNodes.splice(index, 1); //remove node
            if(this.selectedNodes.length > 0) this.condNode = this.selectedNodes[this.selectedNodes.length-1].condNode //get previous node
            else this.condNode = this.startNode //if there is not previous node, use start
            this.conditionTextLocal = ''
            this.$nextTick(() => {
                this.$refs.condInputRef.focus()
            })
        },
        getDynConditionText() {
            return editorConditionGraph.getStringCondition(this.selectedNodes)
        },
        clear() {
            this.selectedNodes = [editorConditionGraph.getStartingResult()]
            this.condNode = this.startNode
            this.conditionTextLocal = ''
        }
    }
}

</script>

<style>
.markdown-dyn-condition-root {
}
.markdown-condition-list {
    margin-top:0.5rem;
    width:100%;
}
.markdown-condition-list ul {
  list-style-type: none;
  display:inline;
  padding-left:0px;
  overflow:auto;
}
.markdown-condition-list li {
  display:inline-block;
}
.markdown-actions-cond {
    border: 1px solid #FFCC99;
    background-color:#FFCC99;
}
.markdown-condition-wrong-input {
    color:red;
    font-size:150%;
    margin-left:0.5rem;
}
.markdown-condition-right-input {
    color:green;
    font-size:150%;
    margin-left:0.5rem;
}
.markdown-condition-whisperer-content {
    display: none;
    position: absolute;
    background-color: #f9f9f9;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    max-height:15rem;
    max-width:25rem;
    overflow:hidden;
}

.markdown-condition-whisperer-scroller {
    z-index: 1;
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
}
.markdown-condition-whisperer-content ul{
    list-style-type: none;
    padding-left: 0;
    margin:0;
}
.markdown-condition-whisperer-content li {
    float: none;
    color: black;
    padding: 0.2rem 0.7rem 0.2rem 0.7rem;
    text-decoration: none;
    display: block;
    text-align: left;
    cursor:pointer;
}
.markdown-condition-whisperer-content li:hover {
    background-color: #ddd;
}
</style>