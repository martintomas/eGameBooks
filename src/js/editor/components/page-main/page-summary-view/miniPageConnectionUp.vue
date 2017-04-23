<template>
    <li class='mini-page-connection-up-box' ref='miniPageBox' :style="styleMiniPageBox" @click="activeConnectionPage">
        <dyn-tooltip ref='tooltipMiniPage' class='mini-page-connection-tooltip' :tooltip-id="generateHash('mini-page-up',index)" :allow-automatic-hidding="false" :left-right-orientation='true' :react-to-hover='false'>
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
                </template>
            </span>
        </dyn-tooltip>
        <div class='connetion-icon' :style='styleMiniPageTextBox' @click='showConnectionText'>
            <dyn-tooltip class='dyn-tooltip' ref='tooltipTextMiniPage' :tooltip-id="generateHash('mini-page-up-text',index)" :allow-automatic-hidding="false" :react-to-hover='false' :left-right-orientation='true'>
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
    </li>
</template>

<script>

import MiniPageConnections from 'editor/components/page-main/page-summary-view/miniPageConnections'

export default {
    mixins: [MiniPageConnections],
    computed: {
        page() {
            if(this.model.pageId in this.editorStore.pages.pages) {
                return this.editorStore.pages.pages[this.model.pageId]
            } else {
                console.log('Reverse connection up error!!! Missing reverse page')
                return null
            }
        },
        linkAction() {
            for(let linkId in this.page.actions.link) {
                if(this.page.actions.link[linkId].id === this.model.actionId) return this.page.actions.link[linkId]
            }
            console.log('Reverse connection up error!!! Link is missing')
            return null
        },
        connectionText() {
            if(this.existsInText) { //should be possible to find this info in rendered info
                let text = document.getElementById('link-'+this.model.pageId+'-'+this.model.actionId)
                if(text) return String.shaveHTML(text.innerHTML,100)
            }
            return ''
        },
        existsInText() {
            return this.linkAction.existsInText
        }
    },
}
</script>

<style> 
.mini-page-connection-up-box {
    position: absolute;
    height:100%;
    
    transition: left 0.5s;
}
.mini-page-connection-tooltip {
    height:85%;
}
.mini-page-connection {
    height: 100%;
    border: solid 0.1rem black;
    border-radius: 0.25rem;
    -webkit-border-radius: 0.25rem;
    -moz-border-radius: 0.25rem;
    background-color: white;
    overflow:hidden;
}
.mini-page-connection-up-box .active-page {
    border-color: blue;
}
.mini-page-connection-tittle {
    text-align: center;
    background-color: lightgray;
    border-bottom: solid 0.1rem black;
    font-weight: bold;
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
}
.mini-page-connection-content {
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    background-color: white;
}
.connetion-icon {
    text-align:center;
    font-size:130%;

    transition: width 0.5s;
}
.connetion-icon .missing {
    color:red;
}
.connetion-icon .used {
    color:blue;
}
</style>