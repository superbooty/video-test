<template>
  <div id="app">
    <Header msg="Content and Commerce Category Page" />
    <div class="separator"></div>
    <div class="page">
      <shoppable-video></shoppable-video>
    </div>
  </div>
</template>

<script>
import ShoppableVideo from "./components/ShoppableVideo.vue";

export default {
  name: "App",

  setup(props) {
    console.log("PROPS :: ", props);
  },

  components: {
    ShoppableVideo,
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
  margin-top: 60px;
}

.page {
  max-width: 800px;
  display: inline-block;
  /* width: 800px; */
}
</style>
