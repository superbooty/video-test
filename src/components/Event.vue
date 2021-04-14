<template>
  <section class="header">
    <ul class="menu">
      <li class="menu-item" @click="toggleAdmin" >Message Console</li>
    </ul>
  </section>
  <registration v-if="!registered" ></registration>
  <shoppable-video v-else></shoppable-video>
</template>

<script>
import Registration from "../components/registration/Registration.vue";
import ShoppableVideo from "./ShoppableVideo";

import { computed} from "vue";
import userState from "@/state/userState"

export default {
  setup() {

    // const registered = ref(false);
    const {state, toggleMsgConsole} = userState();

    const registered = computed(() => {
      console.log("STATE :: ", state.value);
      return state.value.registered;
    });

    const toggleAdmin = () => {
      toggleMsgConsole();
    }

    return {
      registered,
      toggleAdmin
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

.header {
  &::after {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E");
    background: black;
    position: absolute;
    text-align: left;
    left: 150px;
    top: 10px;
  }
  margin: 0 0 10px;
  height: 30px;
  font-size: 12px;
  .menu {
    position: absolute;
    padding: 0px;
    width: 150px;
    list-style-type: none;
    li {

    }
  }
}
</style>
