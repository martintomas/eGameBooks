<template>
    <div class="elements-view-root" ref='elementsViewRoot'>
        <div class='elements-view-main' ref='elementsViewMain'>
            <p class="elements-view-summary-text active-text" @click="showHideElementsList">{{String.doTranslationEditor('page-elements')}}</p>
            <div class="elements-view-main-header">
                <dyn-tooltip class='dyn-tooltip' :reactToHover='false' :reactToClick='true' :tooltip-id="generateHash('show-modules','el-list')">
                    <i class="fa fa-eye active-icon tooltip" aria-hidden="true" slot='tooltip' :component-id="generateHash('show-modules','el-list')"></i>
                    <span slot='tooltipText'>
                        <div class='module-select-button' v-for='(model,index) in hiddenModules' @click='showModule(model)'>
                            <template v-if="model === 'item'">{{String.doTranslationEditor('item-module')}}</template>
                            <template v-else-if="model === 'journal'">{{String.doTranslationEditor('journal-module')}}</template>
                        </div>
                        <div class='module-select-button' @click='showModule(null)'>{{String.doTranslationEditor('all')}}</div>
                    </span>
                </dyn-tooltip>
                <dyn-tooltip class='dyn-tooltip' :reactToHover='false' :reactToClick='true' :tooltip-id="generateHash('hide-modules','el-list')">
                    <i class="fa fa-eye-slash active-icon tooltip" aria-hidden="true" slot='tooltip' :component-id="generateHash('hide-modules','el-list')"></i>
                    <span slot='tooltipText'>
                        <div class='module-select-button' v-for='(model,index) in shownModules' @click='hideModule(model)'>
                            <template v-if="model === 'item'">{{String.doTranslationEditor('item-module')}}</template>
                            <template v-else-if="model === 'journal'">{{String.doTranslationEditor('journal-module')}}</template>
                        </div>
                        <div class='module-select-button' @click='hideModule(null)'>{{String.doTranslationEditor('all')}}</div>
                    </span>
                </dyn-tooltip>
            </div>
            <div class="elements-view-main-wrapper" ref="elementsViewMainWrapper">
                <div class="elements-view-main-scroller" ref="elementsViewMainScroller" v-if='shownModules.length > 0'>
                    <template v-for="(model,index) in shownModules">
                        <elements-item-view v-if="model === 'item'" :key='model' :outer-scroller='scroller' @size-changed='sizeChanged' @active-item-workspace='activeItemWorkspace' :item-message='itemMessage'></elements-item-view>
                    </template>
                </div>
                <div class='no-module-root' v-else>
                    <span class='no-module-text'>{{String.doTranslationEditor('no-module-shown')}}</span>
                </div>
            </div>
            <div class="elements-view-main-footer text-center">This is footer</div>
        </div>

        <!-- prepare environment for modules -->
        <template v-for="(model,index) in shownModules">
            <item-module-workspace v-if="model === 'item'" :key='model' :item-data='itemData' @workspace-message='workspaceMessage'></item-module-workspace>
        </template>

    </div>
</template>

<script>
import IScroll from 'iscroll'
import Vue from 'vue'
import {bus} from 'app.js'
import {busEditor} from 'editor/services/defaults.js'
import * as mutationTypes from 'editor/store/mutationTypes'
import {waitForResizeEnd,setCss3Style,generateHash} from 'defaults.js'
import DynTooltip from 'editor/components/dyn-components/dynTooltip.vue'
import ElementsItemView from 'editor/components/page-elements/elementsItemView.vue'
import ItemModuleWorkspace from 'editor/components/page-elements/itemModuleWorkspace.vue'

export default {
    components: {
        DynTooltip,
        ElementsItemView,
        ItemModuleWorkspace,
    },
    data() {
        return {
            scrollWrapper: 'elementsViewMainWrapper',
            scrollContainer: 'elementsViewMainScroller',
            scroller: null,
            itemData: null,
            itemMessage: null,
            hiddenModules: [],
        }
    },
    computed: {
        usedModules() {
            if('usedModules' in this.$store.state.editor.bookData.mainInfo) return this.$store.state.editor.bookData.mainInfo.usedModules
            return []
        },
        shownModules() {
            if(this.hiddenModules.length === 0) {
                return this.usedModules
            } else {
                let show, res = []
                for(let i=0;i<this.usedModules.length;i++) {
                    show = true
                    for(let j=0;j<this.hiddenModules.length;j++) {
                        if(this.usedModules[i] === this.hiddenModules[j]) show = false
                    }
                    if(show) res.push(this.usedModules[i])
                }
                return res
            }
        },
        itemModuleExists() {
            return this.usedModules.indexOf('item') >= 0
        }
    },
    created() {
        busEditor.$on('editor-panel-shown-fast', source => {
            if(this.$refs.elementsViewRoot) { //this element have to be created and mounted
                 if(source != this.$refs.elementsViewRoot) { //some other list changed its status (probably element list)
                    if(this.$store.state.editor.editorStatus.elementsListShow) { //if this list is show --> check if this should be automaticaly hidden
                        if(window.innerWidth/this.$refs.elementsViewRoot.clientWidth < this.$store.state.editor.editorConfig.listsShownTogetherLimit) { //keep hidden by default (when widht si too small)
                            this.hideImmidiatelyElementList()
                        }
                    }
                 }
            }
        })

        bus.$on('window-resize-end', source => {
            if(this.$refs.elementsViewRoot) {
                if(this.$store.state.editor.editorStatus.elementsListShow) {
                    if(window.innerWidth/this.$refs.elementsViewRoot.clientWidth < this.$store.state.editor.editorConfig.listsAutomaticHide) { //keep hidden by default (when widht si too small)
                        this.hideElementList()
                    }
                }
            }
        })
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

        if(window.innerWidth/this.$refs.elementsViewRoot.clientWidth < this.$store.state.editor.editorConfig.miniElementListWindowWidthAutomaticShown) { //keep hidden by default (when widht si too small)
            this.hideImmidiatelyElementList()
        }

    },
    methods: {
        generateHash,
        sizeChanged() {
            setTimeout(() => {
                this.scroller.refresh() //actualize scroller based on new height
            }, 200)
        },
        activeItemWorkspace(args) {
            switch(args.module) {
                case 'item':
                    this.itemData = args
                    break
                default:
                    console.log('Module is missing')
            }
        },
        workspaceMessage(args) {
            switch(args.module) {
                case 'item':
                    this.itemMessage = args
                    break
                default:
                    console.log('Module is missing')
            }
        },
        showModule(moduleName=null) {
            if(moduleName === null) { //show all
                this.hiddenModules = []
            } else {
                for(let i=0;i<this.hiddenModules.length;i++) {
                    if(this.hiddenModules[i] === moduleName) {
                        Vue.delete(this.hiddenModules,i)
                        break
                    }
                }
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    this.scroller.refresh() //actualize scroller based on new height
                }, 200)
            })
        },
        hideModule(moduleName=null) {
            if(moduleName === null) { //hide all
                for(let i=0;i<this.usedModules.length;i++) {
                    if(this.hiddenModules.indexOf(this.usedModules[i]) === -1) {
                        this.hiddenModules.push(this.usedModules[i])
                    }
                }
            } else {
                this.hiddenModules.push(moduleName)
            }
            this.$nextTick(() => {
                setTimeout(() => {
                    this.scroller.refresh() //actualize scroller based on new height
                }, 200)
            })
        },
        showHideElementsList() {
            //console.log('Changing page elements show')
            if(!this.$store.state.editor.editorStatus.elementsListShow) {
                this.showElementList()
            } else {
                this.hideElementList()                
            }
        },
        hideElementList() {
            this.$refs.elementsViewRoot.classList.add('elements-hide-root')
            this.$refs.elementsViewMain.classList.add('elements-hide-main')
            this.$store.commit('editor/'+mutationTypes.CHANGE_ELEMENTS_LIST_STATUS,false)
            this.updateWindowResize()
        },
        hideImmidiatelyElementList() {
            setCss3Style(this.$refs.elementsViewRoot,'transition','width 0s')
            setCss3Style(this.$refs.elementsViewMain,'transition','right 0s')

            this.hideElementList()

            setTimeout(() => {
                setCss3Style(this.$refs.elementsViewRoot,'transition','width 0.3s')
                setCss3Style(this.$refs.elementsViewMain,'transition','right 0.3s')
            },250)
        },
        showElementList() {
            this.$refs.elementsViewRoot.classList.remove('elements-hide-root')
            this.$refs.elementsViewMain.classList.remove('elements-hide-main')
            this.$store.commit('editor/'+mutationTypes.CHANGE_ELEMENTS_LIST_STATUS,true)
            busEditor.$emit('editor-panel-shown-fast', this.$refs.elementsViewRoot)
            this.updateWindowResize()
        },
        updateWindowResize() {
            setTimeout(() => {
                waitForResizeEnd(() => {
                    busEditor.$emit('editor-panel-resize', this.$refs.elementsViewRoot)
                },this.$refs.elementsViewRoot,true)
            },50)
        }
    }
}

</script>

<style>
    .elements-view-root {
        flex: 0 0 auto;
        /*background-color: green;*/
        height: 100%;
        min-height:35rem;
        width: 20rem;
        background-color:white;

        transition: width 0.3s;
    }

    .elements-view-main {
        position:absolute;
        width: 19rem;
        height: 100%;
        min-height:35rem;
        /*border: 0.05rem solid black;*/
        /*margin: 0.2rem 0.2rem 0.2rem 0.2rem;*/
        background: url('/img/editor/page-elements-without-text.svg') no-repeat top right;
        background-size: contain;
        right:0rem;
        z-index:10000;
        background-color:white;

        transition: right 0.3s;
    }

    .elements-hide-root {
        width:3rem;
    }

    .elements-view-root .elements-hide-main {
        right: -16.5rem;
    }   

    .elements-view-summary-text {
        /*    transform: rotate(90deg) translate(8rem, -16rem); */
        cursor: pointer;
        position: absolute;
        top: 8rem;
        right: 2rem;
        transform: rotate(90deg);
        -webkit-transform: rotate(90deg);
        transform-origin: left top 0;
        -webkit-transform-origin: left top 0;
        color: white;
        font-size: 2rem;
        font-weight: bold;
        /* has to be lower than 10000 and bigger than 1 */
        z-index: 2;
    }
    .elements-view-main-header {
        position: absolute;
        width: 17rem;
        top: 0;
        padding: 0.35rem 0.7rem 0.25rem 2.5rem;
    }
    .elements-view-main-header i {
        color:white;
        font-size:2.2rem;
        padding: 0.2em;
    }
    .elements-view-main-wrapper {
        position: absolute;
        /*z-index: 1;*/
        top: 3.5rem;
        bottom: 2rem;
        left: 2.5rem;
        width: calc(100% - 2.5rem);
        overflow: hidden;
    }
    
    .elements-view-main-scroller {
        /*z-index: 1;*/
        position:relative;
        left: 2px;
        width: calc(100% - 13px); /*left some place for scroller*/
        transform: translateZ(0);
        user-select: none;
        text-size-adjust: none;
    }
    .elements-view-main-footer {
        position: absolute;
        bottom: 1rem;
        width: 100%;
    }
    .module-select-button {
        cursor:pointer;
        font-size: 105%;
        padding: 0 0.2rem 0 0.2rem;
    }
    .module-select-button:hover {
        background-color:gray;
        color:white;
    }
    .no-module-root {
        margin: 0 auto;
        padding: 3rem;
        margin-top: 2rem;
    }
    .no-module-text {
        font-size:135%;
        font-weight:bold;
    }
</style>