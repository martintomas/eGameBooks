<template>
    <div class='elements-module-root'>
        <dyn-tooltip class='module-name' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('item-module','main-items')">
            <span class="tooltip module-name-text" slot='tooltip' :component-id="generateHash('item-module','main-items')">
                {{String.doTranslationEditor('item-module')}}
            </span>
            <span slot='tooltipText'>
                <dyn-tooltip class='dyn-tooltip'>
                    <i class="fa fa-plus unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='newItem'></i>
                    <span slot='tooltipText'>{{String.doTranslationEditor('new-module-item')}}</span>
                </dyn-tooltip>
                <dyn-tooltip class='dyn-tooltip'>
                    <i class="fa fa-gear unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click=''></i>
                    <span slot='tooltipText'>{{String.doTranslationEditor('module-manager-open')}}</span>
                </dyn-tooltip>
            </span>
        </dyn-tooltip>

        <div class="elements-module-wrapper" ref="elementsModuleWrapper">
            <div class="elements-module-scroller" ref="elementsModuleScroller">
                <table class='elements-module-items'>
                    <tr><th>ID</th><th>{{String.doTranslationEditor('name')}}</th><th>{{String.doTranslationEditor('used')}}</th></tr>
                    <tr v-for='(model,key,index) in localItems' :class="[activeModuleItem == key ? 'active':'']" @click='rowClicked(key)'>
                        <td>
                            {{model.localId}}
                        </td>
                        <td>
                            <dyn-tooltip ref='rowTooltip' style='width:100%;' :ignoreDefaultBehavior='true' :allowAutomaticHidding='false' >
                                <span slot='tooltip' class='elements-module-item'>
                                    {{model.name}}
                                </span>
                                <span slot='tooltipText'>
                                    <template v-if='activeModuleItem == key'>
                                        <dyn-tooltip class='dyn-tooltip'>
                                            <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='editItemModule(key,$event)'></i>
                                            <span slot='tooltipText'>{{String.doTranslationEditor('edit-module-item')}}</span>
                                        </dyn-tooltip>
                                        <dyn-tooltip class='dyn-tooltip'>
                                            <i class="fa fa-question unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='infoItemModule(key,$event)'></i>
                                            <span slot='tooltipText'>{{String.doTranslationEditor('info-module-item')}}</span>
                                        </dyn-tooltip>
                                        <dyn-tooltip class='dyn-tooltip'>
                                            <i class="fa fa-trash unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='deleteItemModule(key,$event)'></i>
                                            <span slot='tooltipText'>{{String.doTranslationEditor('delete-module-item')}}</span>
                                        </dyn-tooltip>
                                    </template>
                                </span>

                            </dyn-tooltip>
                        </td>
                        <td>
                            <template v-if='reverseInfoItems[model.localId]'>
                                {{reverseInfoItems[model.localId].length}}
                            </template>
                            <template v-else>
                                0
                            </template>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class='elements-module-bottom'>
            <i class="active-icon fa fa-chevron-up" aria-hidden="true" @click="decreaseHeight"></i>
            <i class="active-icon fa fa-chevron-down" aria-hidden="true" @click="increaseHeight"></i>
        </div>

    </div>
</template>

<script>
import IScroll from 'iscroll'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import DynModal from 'editor/components/dyn-components/dynModal.vue'
import { generateHash } from 'defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'
import {messageBoxWrapper} from 'editor/services/defaults.js'

export default {
    components: {
        DynTooltip,
        DynModal,
    },
    props: {
        outerScroller: Object,
        itemMessage: null,
    },
    data() {
        return {
            scrollWrapper: 'elementsModuleWrapper',
            scrollContainer: 'elementsModuleScroller',
            scroller: null,
            increaseDecreaseValue: null,
            shownTooltip: null,
        }
    },
    computed: {
        items() {
            return this.$store.state.editor.items
        },
        localItems() {
            return this.items.workspace.local
        },
        reverseInfoItems() {
            return this.items.reverseInfo
        },
        activeModuleItem() {
            return this.$store.state.editor.items.selectedItem
        }
    },
    watch: {
        activeModuleItem(value) {
            if(this.shownTooltip != null) { //if some tooltip is shown -> hide it
                this.shownTooltip.hide()
                this.shownTooltip = null
            }

            if(value != null) { 
                let index = this.getKeyIndex(value)
                this.$nextTick(() => { //wait for item rendering
                    this.showTooltip(index)
                })
                
            }
        },
        localItems() {
            setTimeout(() => {
                this.scroller.refresh() //actualize scroller when number of item changes
            }, 200)
        },
        itemMessage(value) {
            switch(value.message) {
                case 'new-item': //new item was created
                    let index = this.getKeyIndex(this.activeModuleItem)
                    setTimeout(() => {
                        if(this.scroller != null && this.$refs.rowTooltip[index]) { //scroll automaticaly only to new items
                            this.scroller.scrollToElement(this.$refs.rowTooltip[index].$el,100) //move scroller to element
                        }
                    },250)
                    break
                default:
                    console.log('Unknow message type')
            }
        }
    },
    mounted() {
        //set up scroller
        this.scroller = new IScroll(this.$refs[this.scrollWrapper], {
            mouseWheel: true,
            bounce: false,
            interactiveScrollbars: true,
            shrinkScrollbars: 'clip',
            scrollbars: 'custom',
        })

        //inspired by https://github.com/cubiq/iscroll/issues/392
        let self = this
        this.scroller.on('scrollStart', function() {
            if ((this.y < 0 && this.directionY == -1) || (this.y > this.maxScrollY) && this.directionY == 1) {
                self.outerScroller.disable();
            }
        })
        this.scroller.on('scrollEnd', function() {
            self.outerScroller.enable();
        })

        this.increaseDecreaseValue = this.$refs[this.scrollWrapper].clientHeight/2
    },
    methods: {
        generateHash,
        newItem(event) {
            this.$emit('active-item-workspace',{
                module:'item',
                type:'new-item'
            })
        },
        getKeyIndex(localId) {
            let index = 0
            for(let key in this.localItems) { //find appropriate position of key
                if(key == localId) return index
                index += 1
            }
        },
        rowClicked(itemLocalId) {
            if(itemLocalId === this.activeModuleItem) {
                this.$store.commit('editor/'+mutationTypes.SELECTED_ITEM_CHANGED,null)
            } else {
                this.$store.commit('editor/'+mutationTypes.SELECTED_ITEM_CHANGED,itemLocalId)
            }
        },
        deleteItemModule(itemLocalId,event) {
            if (event) event.stopPropagation()
            
            if(itemLocalId in this.localItems) {
                messageBoxWrapper.showWarnMessageStorno(this.$store.commit,String.doTranslationEditor('message-delete-item-module'),() => {
                    this.hideTooltip(this.getKeyIndex(itemLocalId)) //hide tooltip before item is deleted
                    this.$store.dispatch('editor/deleteItemModule',itemLocalId)
                })
            }
        },
        infoItemModule(itemLocalId,event) {
            if (event) event.stopPropagation()

            if(itemLocalId in this.localItems) {
                let item = this.localItems[itemLocalId]
                this.$emit('active-item-workspace',{
                    module:'item',
                    type:'info-item',
                    item: item,
                    workspace: 'local'
                })
            }
        },
        editItemModule(itemLocalId,event) {
            if (event) event.stopPropagation()

            if(itemLocalId in this.localItems) {
                let item = this.localItems[itemLocalId]
                this.$emit('active-item-workspace',{
                    module:'item',
                    type:'edit-item',
                    item: item,
                    workspace: 'local'
                })
            }
        },
        decreaseHeight() {
            if(this.$refs[this.scrollWrapper].clientHeight > 50) {
                this.$refs[this.scrollWrapper].style.maxHeight =  this.$refs[this.scrollWrapper].clientHeight - this.increaseDecreaseValue + 'px'

                setTimeout(() => {
                    this.scroller.refresh() //actualize scroller based on new height
                }, 200)

                this.$emit('size-changed')
            }
        },
        increaseHeight() {
            if(this.$refs[this.scrollWrapper].clientHeight < 1500) {
                this.$refs[this.scrollWrapper].style.maxHeight =  this.$refs[this.scrollWrapper].clientHeight + this.increaseDecreaseValue + 'px'

                setTimeout(() => {
                    this.scroller.refresh() //actualize scroller based on new height
                }, 200)

                this.$emit('size-changed')
            }
        },
        showTooltip(itemIndex) {
            this.shownTooltip = this.$refs.rowTooltip[itemIndex]
            this.$refs.rowTooltip[itemIndex].show()
        },
        hideTooltip(itemIndex) {
            this.shownTooltip = null
            this.$refs.rowTooltip[itemIndex].hide()
        }
    }
}
</script>

<style>
.elements-module-root {
    width:100%;
    background-color: white;
    border-radius:0.5rem;
    border: black 1px solid;
}
.module-name {
    width:100%;
    text-align:center;
    background-color: gray;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    padding: 0.3rem;
    margin: 0;
    box-sizing: border-box;
    cursor:pointer;
}
.module-name-text {
    font-size: 120%;
    font-weight: bold;
}
.elements-module-items {
    width:90%;   
    border-collapse: collapse;
    margin: 0.2rem auto;
}
.elements-module-items tr {
    border-bottom: black 1px solid;
    text-align:center;
    cursor:pointer;
}
.elements-module-items tr:first-child { 
    border-width:2px;
}
.elements-module-items tr:last-child { 
    border:none;
}
.elements-module-items tr:hover {
    background-color:gray;
}
.elements-module-items .active {
    background-color:gray;
}
.elements-module-item {
    padding:0.2rem;
}
.elements-module-wrapper {
    /*position: absolute;*/
    /*z-index: 1;*/
    position:relative;
    max-height:50vh;
    overflow: hidden;

    transition: max-height 0.1s ease-out
}

.elements-module-scroller {
    /*position: absolute;*/
    /*z-index: 1;*/
    width: 100%;
    transform: translateZ(0);
    user-select: none;
    text-size-adjust: none;
    padding-bottom: 5px;
}
.elements-module-bottom {
    text-align:center;
    font-size:150%;
}
.elements-module-bottom i {
    margin: 0 1rem 0 1rem;
}
</style>