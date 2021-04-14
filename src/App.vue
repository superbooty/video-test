<template>
  <div id="app">
    <div class="page">
      <event></event>
    </div>
  </div>
</template>

<script>
import Event from "./components/Event.vue";

export default {
  name: "App",

  setup(props) {
    console.log("PROPS :: ", props);
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

.page {
  display: flex;
  margin: auto;
  flex-direction: column;
}
</style>
