<template>
<div ref="dynPageDetail" class="modal">
    <div class='modal-middle-center' ref="dynPageDetailCenter">
        <div class="modal-content">
            <template v-if='pageData != null'>
                <div class="modal-header">
                    {{String.doTranslationEditor('page-zoom-modal-header',(pageData.data.pageNumber))}}&nbsp;
                    <i class="fa fa-edit unactive-icon tooltip" aria-hidden="true" slot='tooltip' @click='loadPage'></i>
                    <span class="close float-right" @click='close'><i class="fa fa-close unactive-icon" aria-hidden="true" @click='close'></i></span>
                </div>
                <div class="modal-body">
                    <div class='vertical-div float-left' v-if="closestSmallerPage != null" @click='previousPage'>
                        <span class='modal-middle-center'>
                            <i class="fa fa-chevron-left unactive-icon" aria-hidden="true"></i>
                        </span>
                    </div>
                    <div class='vertical-div float-right' v-if="closestBiggerPage != null" @click='nextPage'>
                        <span class='modal-middle-center'>
                            <i class="fa fa-chevron-right unactive-icon" aria-hidden="true"></i>
                        </span>
                    </div>
                    <dyn-text-renderer class='page-detail-text' :page-data='pageData' render-type='pageDetail'></dyn-text-renderer>
                </div>
                <div class="modal-footer">
                    {{String.doTranslationEditor('page-num',(pageData.data.pageNumber))}}
                </div>
            </template>
        </div>
    </div>
    
</div>
</template>

<script>
import DynTextRenderer from 'editor/components/page-main/page-main-text/dynTextRenderer.js'
import {bus} from 'app.js'
import {busEditor} from 'editor/services/defaults.js'

export default {
    components: {
        DynTextRenderer
    },
    props: {
    },
    data() {
        return {
            pageId:0,
        }
    },
    computed: {
        pageData() {
            if(this.pageId in this.$store.state.editor.bookData.pages) return this.$store.state.editor.bookData.pages[this.pageId]
            else return null
        },
        closestSmallerPage() {
            if(this.pageId != null) {
                let indexActual = this.$store.state.editor.bookData.pagesOrder.indexOf(this.pageId)
                if(indexActual > 0) return this.$store.state.editor.bookData.pages[this.$store.state.editor.bookData.pagesOrder[indexActual-1]]
            }
            return null
        },
        closestBiggerPage() {
            if(this.pageId != null) {
                let indexActual = this.$store.state.editor.bookData.pagesOrder.indexOf(this.pageId)
                if(indexActual < this.$store.state.editor.bookData.pagesOrder.length - 1 && indexActual != -1) return this.$store.state.editor.bookData.pages[this.$store.state.editor.bookData.pagesOrder[indexActual+1]]
            }
            return null
        }
    },
    mounted() {
        busEditor.$on('show-page-detail',pageId => {
            this.pageId = pageId
            this.show()
        })

        bus.$on('automatic-hide',source => { //listen for indirect event for hidding modal
            if(source.target == this.$refs.dynPageDetail || source.target == this.$refs.dynPageDetailCenter) {
                this.close()
            }
        })
    },
    methods: {
        show() {
            this.$refs.dynPageDetail.style.display = "table"
        },
        close() {
            this.$refs.dynPageDetail.style.display = "none"
        },
        previousPage() {
            this.pageId = this.closestSmallerPage.data.id
        },
        nextPage() {
            this.pageId = this.closestBiggerPage.data.id
        },
        loadPage() {
            this.close()
            this.$router.push({ name: 'editor-page-view', params: { pageId: this.pageId }})
        }
    }
}
</script>

<style>
.modal-content {
    position: relative;
    background-color: #fefefe;
    margin:auto;
    padding: 0;
    border: 1px solid #888;
    border-radius: 1.2rem;
    width: 80%;
    min-width:6rem;
    height: 80vh;
    min-height:5rem;
    animation-name: animatetop;
    animation-duration: 0.4s
}

@keyframes animatetop {
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
}

.modal-header {
    padding: 0.2rem 2%;
    background-color: gray;
    font-size: 130%;
    font-weight: bold;
    height: 1.5rem;
    line-height: 1.5rem;
    vertical-align: middle;
    text-align:center;
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}
.modal-body {
    height: calc(100% - 3.9rem);
    box-sizing: border-box;
}
.page-detail-text {
    margin:0 auto;
    padding: 1rem 0;
    width: 88%;
}
.page-detail-text p{
    margin: 0;
}
.vertical-div {
    width:5%;
    font-size:200%;
    height: 100%;
    display: table;
    text-align: center;
    cursor:pointer;
}
.vertical-div:hover {
    background-color: rgb(204, 204, 204);
}
.modal-footer {
    position: absolute;
    padding: 0.2rem 2%;
    background-color: gray;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    text-align:center;
    height: 2rem;
    line-height: 2rem;
    vertical-align: middle;
    font-size: 140%;
    font-weight: bold;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}
</style>