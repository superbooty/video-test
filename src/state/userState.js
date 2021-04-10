// store/todos.js
import {ref } from "vue";

const state = ref({
    userName: null,
    email: null,
    registered: false,
});

export default function userState() {
    // do the registration here
    const register = (userName, email) => {
        // check if the user has already been registered
        // for a real validation this would be checked via
        // an API
        console.log("STATE :: ", state);
        if (!state.value.email || !state.value.userName) {
            if (userName && email) {
                state.value.userName = userName;
                state.value.email = email;
                state.value.registered = true;
            } else {
                return false;
            }
        } else {
            console.log("user has already registered :: ");
        }
        return true;
    }   
    return {state, register}
}
