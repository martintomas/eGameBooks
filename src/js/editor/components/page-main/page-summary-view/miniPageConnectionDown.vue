<template>
    <li class='mini-page-connection-down-box' ref='miniPageBox' :style="styleMiniPageBox" @click="activeConnectionPage">
        <div class='connetion-icon' :style='styleMiniPageTextBox' @click='showConnectionText'>
            <dyn-tooltip class='dyn-tooltip' ref='tooltipTextMiniPage' :tooltip-id="generateHash('mini-page-up-text',index)" :allow-automatic-hidding="false" :react-to-hover='false' :left-right-orientation='true' :zIndex='500'>
                <template v-if='existsInText'>
                    <i class="fa fa-square unactive-icon used" aria-hidden="true" slot='tooltip'></i>
                    <span slot='tooltipText' v-html='connectionText'></span>
                </template>
                <template v-else>
                    <i class="fa fa-square unactive-icon missing" aria-hidden="true" slot='tooltip'></i>
                    <span slot='tooltipText'>{{String.doTranslationEditor('unused-link')}}</span>
                </template>
            </dyn-tooltip>
        </div>
        <dyn-tooltip ref='tooltipMiniPage' class='mini-page-down-connection-tooltip' :tooltip-id="generateHash('mini-page-up',index)" :allow-automatic-hidding="false" :left-right-orientation='true' :react-to-hover='false'>
            <div class="mini-page-connection" ref='miniPage' slot='tooltip' :style="styleMiniPage">
                <div class="mini-page-connection-tittle">
                    {{String.doTranslationEditor('page-num',(pageNumber))}}
                </div>
                <div class="mini-page-connection-content" v-html="simpleText">
                </div>
            </div>
            <span slot='tooltipText'>
                <template v-if='active'>
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-edit unactive-icon" aria-hidden="true" slot='tooltip' @click='editMiniPage'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('edit-page')}}</span>
                    </dyn-tooltip>
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-search unactive-icon" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('zoom-mini-page')}}</span>
                    </dyn-tooltip>
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-trash unactive-icon" aria-hidden="true" slot='tooltip'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('delete-link')}}</span>
                    </dyn-tooltip>
                </template>
            </span>
        </dyn-tooltip>
    </li>
</template>

<script>

import MiniPageConnections from 'editor/components/page-main/page-summary-view/miniPageConnections'

export default {
    mixins: [MiniPageConnections],
    props: {
        pageEditedId: 0,
    },
    computed: {
        page() {
            if(this.model.pageId in this.editorStore.pages.pages) {
                return this.editorStore.pages.pages[this.model.pageId]
            } else {
                console.log('Page connection down error!!! Missing page id')
                return null
            }
        },
        connectionText() {
            if(this.model.existsInText) { //should be possible to find this info in rendered info
                let text = document.getElementById('link-'+this.pageEditedId+'-'+this.model.id)
                if(text) return String.shaveHTML(text.innerHTML,100)
            }
            return ''
        },
        existsInText() {
            return this.model.existsInText
        }
    }
}


</script>

<style> 
.mini-page-connection-down-box {
    position: absolute;
    height:100%;
    
    transition: left 0.5s;
}
.mini-page-down-connection-tooltip {
    height:84%;
}
.mini-page-connection-down-box .active-page {
    border-color: blue;
}

</style>