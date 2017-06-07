<template>
    <div class='modal' ref='messageBox' style="z-index:9000000">
        <div class='modal-middle-center'>
            <template v-if='numMessages > 0'>
                <div class='message-box'>
                    <div class='modal-middle-center'>

                        <i v-if="getFirstMessage.type === 'info'" class="fa fa-info fa-5x message-box-icon float-left" aria-hidden="true"></i>
                        <i v-else-if="getFirstMessage.type === 'warn'" class="fa fa-warning fa-5x message-box-icon float-left" aria-hidden="true"></i>
                        <i v-else-if="getFirstMessage.type === 'error'" class="fa fa-exclamation-circle fa-5x message-box-icon float-left" aria-hidden="true"></i>
                        
                        <span v-html='getFirstMessage.message'></span>
                    
                    <span v-if="getFirstMessage.buttonType === 'ok'" class='message-box-buttons'>
                        <a href='#' class='message-box-button ok' @click='callFunc1'>{{String.doTranslationCore('ok')}}</a>
                    </span>
                    <span v-else-if="getFirstMessage.buttonType === 'storno'" class='message-box-buttons'>
                        <a href='#' class='message-box-button ok' @click='callFunc1'>{{String.doTranslationCore('ok')}}</a>
                        <a href='#' class='message-box-button storno' @click='deleteMessage'>{{String.doTranslationCore('storno')}}</a>
                    </span>
                    <span v-else-if="getFirstMessage.buttonType === 'choice'" class='message-box-buttons'>
                        <a href='#' class='message-box-button ok' @click='callFunc1'>{{String.doTranslationCore('yes')}}</a>
                        <a href='#' class='message-box-button storno' @click='callFunc2'>{{String.doTranslationCore('no')}}</a>
                    </span>

                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import * as mutationTypes from 'core/store/mutationTypes'

export default {
    data() {
        return {
            shownMessageIndex: 0
        }
    },
    computed: {
        numMessages() {
            return this.$store.state.core.messageBox.messages.length
        },
        getFirstMessage() {
            if(this.numMessages > 0) return this.$store.state.core.messageBox.messages[this.shownMessageIndex]
            else return null
        }
    },
    watch: {
        numMessages(value) {
            this.toogleMessageBox()
        }
    },
    methods: {
        toogleMessageBox() {
            if(this.numMessages > 0) this.show()
            else this.close()
        },
        show() {
            this.$refs.messageBox.style.display = "table"
        },
        close() {
            this.$refs.messageBox.style.display = "none"
        },
        deleteMessage() {
            this.$store.commit('core/'+mutationTypes.DELETE_MESSAGE,this.shownMessageIndex) //delete this message
        },
        callFunc1() {
            if(this.getFirstMessage != null) {
                if(this.getFirstMessage.func1 != null) {
                    if(this.getFirstMessage.args1 != null) this.getFirstMessage.func1(this.getFirstMessage.args1)
                    else this.getFirstMessage.func1()
                }
            }
            this.deleteMessage()
        },
        callFunc2() {
            if(this.getFirstMessage != null) {
                if(this.getFirstMessage.func2 != null) {
                    if(this.getFirstMessage.args2 != null) this.getFirstMessage.func2(this.getFirstMessage.args2)
                    else this.getFirstMessage.func2()
                }
            }
            this.deleteMessage()
        }
    }
}
</script>

<style>
.message-box {
    position:relative;
    margin:auto;
    width: 30%;
    min-width: 10rem;
    max-width: 20rem;
    height: 15%;
    min-height: 7rem;
    max-height: 15rem;
    background-color:white;
    border: solid 1px black;
    border-radius: 0.5rem;
    padding: 1rem 1rem 2rem 1rem;
    font-size:120%;
    display:table;
}
.message-box-icon {
    padding: 0 1rem 0.2rem 1rem;
}
.message-box-buttons {
    position: absolute;
    left: 0;
    bottom: 0;
    padding-bottom: 1rem;
    width: 100%;
    text-align: center;
}
.message-box-button {
    padding: 0.1rem 1rem 0.1rem 1rem;
    margin: 0 0.5rem 0 0.5rem;
    border: solid 1px black;
    border-radius: 0.5rem;
    color: black;
    font-style: normal;
    font-weight: bold;
    text-decoration: none;

    transition: color 0.2s, background-color 0.2s;
}
.message-box-buttons  .ok {
    background-color: coral;
}
.message-box-buttons  .ok:hover {
    background-color: darkslategray;
    color: white;
}
.message-box-buttons  .storno {
    background-color: aliceblue;
}
.message-box-buttons  .storno:hover {
    background-color: darkslategray;
    color: white;
}
</style>