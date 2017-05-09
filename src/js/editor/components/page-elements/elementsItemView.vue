<template>
    <div class='elements-module-root'>
        <p class='module-name'>{{String.doTranslationEditor('item-module')}}</p>
        <div class="elements-module-wrapper" ref="elementsModuleWrapper">
            <div class="elements-module-scroller" ref="elementsModuleScroller">
                <table class='elements-module-items'>
                    <tr><th>{{String.doTranslationEditor('name')}}</th></tr>
                    <tr v-for='(model,key,index) in localItems'>
                        <td>{{model.name}}</td>
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

export default {
    props: {
        outerScroller: Object,
    },
    data() {
        return {
            scrollWrapper: 'elementsModuleWrapper',
            scrollContainer: 'elementsModuleScroller',
            scroller: null,
            increaseDecreaseValue: null,
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
    font-size: 120%;
    font-weight: bold;
    box-sizing: border-box;
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
    padding: 0.2rem;
    cursor:pointer;
}
.elements-module-items td:hover {
    background-color:gray;
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