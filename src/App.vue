<template>
  <div id="app">
    <section class="header">
      <span class="menu-cue"></span>
      <span class="menu-lbl" @click="showMenu = !showMenu">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMgNmgtMTN2LTRoMTN2NHptMCA0aC0xM3Y0aDEzdi00em0wIDhoLTEzdjRoMTN2LTR6bTMtOGw0IDUuMDc1IDQtNS4wNzVoLTh6Ii8+PC9zdmc+">
      </span>
      <span v-if="state.showMsgConsole" class="comm" @click="toggleAdmin"></span>
      <!-- <div class="menu-btn" :class="{'active': showMenu}" @click="showMenu = !showMenu"></div> -->
      <!-- <img class="menu-btn" :class="{'active': showMenu}" @click="showMenu = !showMenu"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E"/> -->
      <ul class="menu" :class="{'off': !showMenu}">
        <li class="menu-item" :class="{'on': state.showMsgConsole}" @click="toggleAdmin" >Messenger Console</li>
      </ul>
    </section>
    <div class="page">
      <event></event>
    </div>
  </div>
</template>

<script>
import Event from "./components/Event.vue";

import {appState} from "@/state/appState"
import { ref } from "vue";

export default {
  name: "App",

  setup(props) {
    console.log("PROPS :: ", props);

    const showMenu = ref(false);

    const { state, toggleMsgConsole } = appState();

    const toggleAdmin = () => {
      toggleMsgConsole();
      showMenu.value = false;
    }

    return {
      toggleAdmin,
      showMenu,
      state
    };
  },

  components: {
    Event,
  },
  mounted() {
  }
};
</script>

<style lang="scss">
@import "assets/scss/_variables.scss";
@import "assets/scss/lscoicons.scss";
@import "assets/scss/levi-fonts.scss";
#app {
  font-family: $helvetica-now;
  -webkit-font-smoothing: antiadivased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.header {
  margin: 0 0 10px;
  height: 42px;
  font-size: 12px;
  border-bottom: 1px solid #d0d0d0;
  .menu-cue {
    height: 40px;
    width: 5px;
    background: #457dff;
    position: absolute;
    left: 0px;
    top: 2px;
  }
  .comm {
    position: absolute;
    left: 60px;
    top: 12px;
    line-height: 24px;
    font-size: 20px;
    &::after {
      content: "⇄";
    }
  }
  .menu-lbl {
    font-size: 12px;
    position: absolute;
    width: 18px;
    height: 18px;
    top: 4px;
    left: 12px;
    padding: 8px;
    border-right: 1px solid #dcdcdc;
    img {
      height: 18px;
    }
  }
  .menu-btn {
    position: absolute;
    -webkit-transition: all .250s;
    transition: all .250s;
    left: 0px;
    top: 6px;
    padding: 4px;
    transform: rotate(-90deg);
    transition: all .250s;
    background: #ededed;
    border-radius: 34px;
    z-index: 10000;
    &.active {
      transform: rotate(0deg);
      background: #457eff;
    }
    &:hover {
      background: red;
      background: #457eff;
    }
  }
  .menu {
    position: absolute;
    top: 30px;
    // left: 12px;
    padding: 0px;
    width: 300px;
    padding: 5px;
    max-height: 50vh;
    height: 50vh;
    transition: all .250s;
    text-align: left;
    list-style-type: none;
    background: white;
    z-index: 10000;
    box-sizing: border-box;
    border-left: 5px solid #457dff;
    border-right: 1px solid gray;
    border-bottom: 1px solid gray;
    li {
      border-bottom: 1px solid #efefef;
      line-height: 30px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1.1px;
      &.on {
        &::after {
          content: "✔︎";
          color: green;
          margin: 0 5px;
        }
      }
    }
    &.off {
      overflow: hidden;
      max-height: 0;
      visibility: hidden;
      padding: 0 0 0 5px;
    }
  }
}

.page {
  display: flex;
  margin: auto;
  flex-direction: column;
  margin: 12px;
}
</style>
