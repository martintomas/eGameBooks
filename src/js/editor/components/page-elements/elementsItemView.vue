<template>
    <div class='elements-module-root'>
        <dyn-tooltip class='module-name' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('item-module','main-items')">
            <span class="tooltip module-name-text" slot='tooltip' :component-id="generateHash('item-module','main-items')">
                {{String.doTranslationEditor('item-module')}}
            </span>
            <span slot='tooltipText'>
                <dyn-tooltip class='dyn-tooltip'>
                    <i class="fa fa-plus unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click=''></i>
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
                    <tr><th>{{String.doTranslationEditor('name')}}</th></tr>
                    <tr v-for='(model,key,index) in localItems' :class="[activeModuleItem === index ? 'active':'']">
                        <td>
                            <dyn-tooltip style='width:100%;' :reactToClick='true' :reactToHover='false' :tooltip-id="generateHash('item-module',index)">
                                <div slot='tooltip' :component-id="generateHash('item-module',index)" @click='activateItem(index)' class='elements-module-item'>
                                    {{model.name}}
                                </div>
                                <span slot='tooltipText'>
                                    <template v-if='activeModuleItem === index'>
                                        <dyn-tooltip class='dyn-tooltip'>
                                            <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click=''></i>
                                            <span slot='tooltipText'>{{String.doTranslationEditor('edit-module-item')}}</span>
                                        </dyn-tooltip>
                                        <dyn-tooltip class='dyn-tooltip'>
                                            <i class="fa fa-trash unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click=''></i>
                                            <span slot='tooltipText'>{{String.doTranslationEditor('delete-module-item')}}</span>
                                        </dyn-tooltip>
                                    </template>
                                </span>

                            </dyn-tooltip>
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
import { generateHash } from 'defaults.js'

export default {
    components: {
        DynTooltip,
    },
    props: {
        outerScroller: Object,
    },
    data() {
        return {
            scrollWrapper: 'elementsModuleWrapper',
            scrollContainer: 'elementsModuleScroller',
            scroller: null,
            increaseDecreaseValue: null,
            activeModuleItem: null,
        }
    },
    computed: {
        items() {
            return this.$store.state.editor.items
        },
        localItems() {
            return this.items.workspace.local
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

        this.increaseDecreaseValue = this.$refs[this.scrollWrapper].clientHeight/2

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

    },
    methods: {
        generateHash,
        activateItem(itemIndex) {
            this.activeModuleItem = itemIndex
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
}
.elements-module-items tr:first-child { 
    border-width:2px;
}
.elements-module-items tr:last-child { 
    border:none;
}
.elements-module-items td {
    cursor:pointer;
}
.elements-module-items td:hover {
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