<template>
    <div class="elements-view-root" ref='elementsViewRoot'>
        <div class='elements-view-main' ref='elementsViewMain'>
            <p class="elements-view-summary-text active-text" @click="showHideElementsList">{{String.doTranslationEditor('page-elements')}}</p>
        </div>
    </div>
</template>

<script>
import {bus} from 'app.js'
import * as mutationTypes from 'editor/store/mutation-types'
import {waitForResizeEnd,setCss3Style} from 'defaults.js'

export default {
    data() {
        return {
        }
    },
    created() {
        bus.$on('editor-panel-shown-fast', source => {
            if(this.$refs.elementsViewRoot) { //this element have to be created and mounted
                 if(source != this.$refs.elementsViewRoot) { //some other list changed its status (probably element list)
                    if(this.editorStore.editorStatus.elementsListShow) { //if this list is show --> check if this should be automaticaly hidden
                        if(window.innerWidth/this.$refs.elementsViewRoot.clientWidth < this.editorStore.appConf.listsShownTogetherLimit) { //keep hidden by default (when widht si too small)
                            this.hideImmidiatelyElementList()
                        }
                    }
                 }
            }
        })
    },
    mounted() {
        if(window.innerWidth/this.$refs.elementsViewRoot.clientWidth < this.editorStore.appConf.miniElementListWindowWidthAutomaticShown) { //keep hidden by default (when widht si too small)
            this.hideImmidiatelyElementList()
        }
    },
    methods: {
        showHideElementsList() {
            //console.log('Changing page elements show')
            if(!this.editorStore.editorStatus.elementsListShow) {
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
            bus.$emit('editor-panel-shown-fast', this.$refs.elementsViewRoot)
            this.updateWindowResize()
        },
        updateWindowResize() {
            setTimeout(() => {
                waitForResizeEnd(() => {
                    bus.$emit('editor-panel-resize', this.$refs.elementsViewRoot)
                },this.$refs.elementsViewRoot,true)
            },50)
        }
    }
}

</script>

<style>
    .elements-view-root {
        display: flex;
        flex: 0 0 auto;
        /*background-color: green;*/
        height: 100%;
        width: 20rem;

        transition: width 0.3s;
    }

    .elements-view-main {
        position:absolute;
        width: 19rem;
        height: 95%;
        /*border: 0.05rem solid black;*/
        margin: 0.2rem 0.2rem 0.2rem 0.2rem;
        background: url('/img/editor/page-elements-without-text.svg') no-repeat top left;
        right:0rem;

        transition: right 0.3s;
    }

    .elements-hide-root {
        width:3rem;
    }

    .elements-view-root .elements-hide-main {
        right: -17rem;
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
</style>