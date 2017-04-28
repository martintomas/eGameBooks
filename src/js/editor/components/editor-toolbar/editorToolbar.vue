<template>
    <div class='editor-toolbar-root'>
        <div class='editor-toolbars-buttons'>
            <span class='editor-toolbar-button'>{{String.doTranslationEditor('save')}}</span>
            <span class='editor-toolbar-button'>{{String.doTranslationEditor('close')}}</span>
            <span class='editor-toolbar-button'>{{String.doTranslationEditor('new-page-simple')}}</span>
            <span class='editor-toolbar-button'>{{String.doTranslationEditor('undo')}}</span>
            <span class='editor-toolbar-button'>{{String.doTranslationEditor('redo')}}</span>
        </div>
        <notification-line class='notification-line'></notification-line>
    </div>
</template>

<script>

import NotificationLine from 'editor/components/editor-toolbar/notificationLine.vue'

export default {
    components: {
        NotificationLine
    }

}

</script>

<style>
.editor-toolbar-root {
    min-height:2rem;
    width:100%;
    flex: 0 0 auto;
    display:flex;
    flex-direction:row;
}
.editor-toolbars-buttons {
    flex-grow:2;
}
.editor-toolbar-button {
    padding: 0.25rem 1rem 0.25rem 1rem;
    border-radius: 0.25rem;
    border: 1px solid black;
    font-weight:bold;
    font-size:130%;
    display: inline-block;
    line-height: 1.5rem;
    margin: 0.25rem 0.2rem 0.25rem 0.2rem;
    background-color: rgb(0, 78, 102);
    color:white;
    cursor:pointer;

    transition: background-color 0.2s, color 0.2s;
}
.editor-toolbar-button:hover {
    background-color: rgb(204, 243, 255);
    color:black;
}

</style>