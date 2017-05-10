<template>
    <div ref="dynModal" class="modal">
        <div class='modal-middle-center' ref="dynModalCenter">
            <div :class="[contentSpecific ,'modal-content']">
                <div :class="[headerSpecific ,'modal-header']">
                    <slot name='modalHeader'></slot>
                    <span class="close float-right" @click='close'><i class="fa fa-close unactive-icon" aria-hidden="true" @click='close'></i></span>
                </div>
                <div :class="[bodySpecific ,'modal-body']">
                    <slot name='modalBody'></slot>
                </div>
                <div :class="[footerSpecific ,'modal-footer']">
                    <slot name='modalFooter'></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import {bus} from 'app.js'

export default {
    props: {
        contentSpecific: {
            default: 'modal-content-specific',
            type: String
        },
        headerSpecific: {
            default: 'modal-header-specific',
            type: String
        },
        bodySpecific: {
            default: 'modal-body-specific',
            type: String
        },
        footerSpecific: {
            default: 'modal-footer-specific',
            type: String
        },
    },
    created() {
        bus.$on('automatic-hide',source => { //listen for indirect event for hidding modal
            if(source.target == this.$refs.dynModal || source.target == this.$refs.dynModalCenter) {
                this.close()
            }
        })
    },
    methods: {
        show() {
            this.$refs.dynModal.style.display = "table"
        },
        close() {
            this.$refs.dynModal.style.display = "none"
        }
    }
}
</script>

<style>
.modal-header {
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}
.modal-header-specific {
    padding: 0.2rem 2%;
    background-color: gray;
    font-size: 130%;
    font-weight: bold;
    height: 1.5rem;
    line-height: 1.5rem;
    vertical-align: middle;
    text-align:center;
}
.modal-body {
    box-sizing: border-box;
}
.modal-body-specific {
    height: calc(100% - 3.9rem);
}
.modal-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    box-sizing: border-box;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}
.modal-footer-specific {
    padding: 0.2rem 2%;
    background-color: gray;
    text-align:center;
    height: 2.4rem;
    line-height: 2rem;
    vertical-align: middle;
    font-size: 140%;
    font-weight: bold;
}
.modal-content {
    position: relative;
    margin:auto;
    padding: 0;
    border: 1px solid #888;
    border-radius: 1.2rem;
    min-width:10rem;
    min-height:5rem;
    animation-name: animatetop;
    animation-duration: 0.4s;
}
.modal-content-specific {
    background-color: #fefefe;
    width: 80%;
    height: 80vh;
}
.close {
    float: right;
    font-size: 28px;
    cursor:pointer;
}

@keyframes animatetop {
    from {top: -300px; opacity: 0}
    to {top: 0; opacity: 1}
}
</style>