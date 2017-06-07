<template>
    <div class='whisperer-root modalInput'>
        <input class="whisperer" :component-id="componentId" v-model.number="filledDataLocal" type="number" :id="inputId" @focus='showWhisperer' @input='showWhisperer'>
        <div class="whisperer-content" ref="dropdownWhisperer">
            <div class="whisperer-scroller" ref="whispererScroller">
                <ul>
                    <li v-for="(model,index) in dataLocal" @click="selectValue(model.id)">
                        <span class='bold'>{{String.doTranslationEditor('item')}} {{model.id}}</span>:
                        <span>{{model.text}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

import {bus} from 'app.js'
import IScroll from 'iscroll'
import {generateHash} from 'defaults'

export default {
    props: {
        existingData: null,
        inputId: ''
    },
    data() {
        return {
             componentId:this.generateHash('data-con-down',0),
             dropdownWhisperer: null,
             filledDataLocal: '',
             scrollWrapper: 'dropdownWhisperer',
        }
    },
    computed: {
        data() {
            return this.$store.state.editor.items.workspace.local
        },
        whispererShaveText() {
            return this.$store.state.editor.editorConfig.whispererShaveHTML
        },
        dataLocal() {
            let temp = [], key, i, text
            let dataLocalStr = String(this.filledDataLocal)
            if(dataLocalStr === '' || dataLocalStr === null) {
                for(key in this.data) {
                    temp.push({
                        'id': this.data[key].localId,
                        'text': String.shaveText(this.data[key].name,this.whispererShaveText)
                    })
                }
            } else {
                for(key in this.data) {
                     if (String(this.data[key].localId).substr(0,dataLocalStr.length) === dataLocalStr) {
                        temp.push({
                            'id': this.data[key].localId,
                            'text':String.shaveText(this.data[key].name,this.whispererShaveText)
                        })
                     }

                }
            }

            if(this.scroller) {
                setTimeout(() => {
                    this.scroller.refresh(); //actualize scroller based on new height (changed when new page number is used)
                }, 200);
            }

            return temp
        },
    },
    watch: {
        existingData(val) { //be sure that when pageNumber prop changes, it has always top priority to be shown
            if(val === null) this.filledDataLocal = ''
            else this.filledDataLocal = val
        }
    },
    mounted() {
        if(this.existingData === null) this.filledDataLocal = ''
        else this.filledDataLocal = this.existingData

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
        })
    },
    methods: {
        generateHash,
        showWhisperer() {
            if(!this.dropdownWhisperer.classList.contains("show-block")) {
                this.dropdownWhisperer.classList.add("show-block")
                setTimeout(() => { //actualize scroller based on new height (whisperer have to be shown)
                    this.scroller.refresh(); 
                }, 200);
            }
        },
        hideWhisperer() {
            if(this.dropdownWhisperer.classList.contains("show-block")) {
                this.dropdownWhisperer.classList.remove("show-block")
            }
        },
        selectValue(value) {
            this.filledDataLocal = value
            this.hideWhisperer()
        },
        clear() {
            if(this.existingData === null) this.filledDataLocal = ''
            else if(this.existingData != this.filledDataLocal) this.filledDataLocal = this.existingData
        },
    }
}
</script>

<style>

</style>