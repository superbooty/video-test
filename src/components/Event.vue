<template>
  <registration v-if="!registered" ></registration>
  <shoppable-video v-else></shoppable-video>
</template>

<script>
import Registration from "../components/registration/Registration.vue";
import ShoppableVideo from "./ShoppableVideo";

import { computed} from "vue";
import {userState} from "@/state/userState"


export default {
  setup() {
    // const registered = ref(false);
    const {state} = userState();

    const registered = computed(() => {
      console.log("STATE :: ", state.value);
      return state.value.registered;
    });

    return {
      registered,
      state
    };
  },
  
  
  components: {
    Registration,
    ShoppableVideo
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
@import "../assets/scss/lscoicons.scss";
@import "../assets/scss/levi-fonts.scss";

h2 {
    background: white;
    font-weight: 900;
    line-height: 36px;
    font-family: arial, sans-serif;
}

</style>
