<template>
    <li class='mini-page-connection-up-box' ref='miniPageBox' :style="styleMiniPageBox" @click="activeConnectionPage">
        <dyn-tooltip ref='tooltipMiniPage' class='mini-page-connection-tooltip' :tooltip-id="generateHash('mini-page-up',index)" :allow-automatic-hidding="false" :left-right-orientation='true' :react-to-hover='false'>
            <div class="mini-page-connection" ref='miniPage' slot='tooltip'>
                <div class="mini-page-connection-tittle">
                    {{String.doTranslationEditor('page-num',(pageNumber))}}
                </div>
                <div class="mini-page-connection-content" v-html="simpleText">
                </div>
            </div>
            <span slot='tooltipText'>
                <template v-if='active'>
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-hand-o-right unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='goToMiniPage'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('go-to-page')}}</span>
                    </dyn-tooltip>
                    <br>
                    <dyn-tooltip class='dyn-tooltip'>
                        <i class="fa fa-search unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='showPageDetail'></i>
                        <span slot='tooltipText'>{{String.doTranslationEditor('zoom-mini-page')}}</span>
                    </dyn-tooltip>
                </template>
            </span>
        </dyn-tooltip>
        <div class='connection-icon' :style='styleMiniPageTextBox' @click='showConnectionText'>
            <dyn-tooltip class='dyn-tooltip' ref='tooltipTextMiniPage' :tooltip-id="generateHash('mini-page-up-text',index)" :allow-automatic-hidding="false" :react-to-hover='false' :left-right-orientation='true'>
                <template v-if='existsInText'>
                    <i class="fa fa-square unactive-icon used tooltip" aria-hidden="true" slot='tooltip'></i>
                    <span slot='tooltipText' v-html='connectionText'></span>
                </template>
                <template v-else>
                    <i class="fa fa-square unactive-icon missing tooltip" aria-hidden="true" slot='tooltip'></i>
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
            if(this.model.pageId in this.$store.state.editor.bookData.pages) {
                return this.$store.state.editor.bookData.pages[this.model.pageId]
            } else {
                console.log('Reverse connection up error!!! Missing reverse page')
                return null 
            }
        },
        linkAction() {
            if(this.model.actionId in this.page.actions.link) return this.page.actions.link[this.model.actionId]
            console.log('Reverse connection up error!!! Link is missing')
            return null
        },
        connectionText() {
            if(this.existsInText) { //should be possible to find this info in rendered info
                let text = document.getElementsByName('link-'+this.model.pageId+'-'+this.model.actionId)
                if(text.length > 0) return String.shaveHTML(text[0].innerHTML,this.$store.state.editor.editorConfig.commentShaveHTMLPageConnection)
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
    
    transition: left 0.2s;
}
.mini-page-connection-tooltip {
    height:85%;
}
.mini-page-connection {
    height: 100%;
    border: solid 1px black;
    border-radius: 0.25rem;
    -webkit-border-radius: 0.25rem;
    -moz-border-radius: 0.25rem;
    background-color: white;
    overflow:hidden;

    width: 10rem;
    min-width:10rem;
}
.mini-page-connection-up-box .active-page {
    border-color: blue;
}
.mini-page-connection-tittle {
    text-align: center;
    background-color: lightgray;
    border-bottom: solid 1px black;
    font-weight: bold;
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
}
.mini-page-connection-content {
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    background-color: white;
}
.connection-icon {
    text-align:center;
    font-size:130%;

    transition: width 0.2s;
}
.connection-icon .missing {
    color:red;
}
.connection-icon .used {
    color:blue;
}
</style>