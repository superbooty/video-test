// store/todos.js
import {ref } from "vue";

const state = ref({
    showMsgConsole: false,
});

export function appState() {
    // do the registration here
    const toggleMsgConsole = () => {
        state.value.showMsgConsole = !state.value.showMsgConsole;
        return {state};
    }   
    return {state, toggleMsgConsole}
}

export default {
    appState,
}