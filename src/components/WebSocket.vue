<template>
  <div class="ws-container">
    <div class="external-msg">{{ externalMsg }}</div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    code: String,
  },

  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const externalMsg = ref(null);

    const connection = new WebSocket(
      "wss://e8nblavjl9.execute-api.us-west-2.amazonaws.com/dev"
    );

    connection.onopen = function () {
      this.send(
        // This message will be routed to 'routeA' based on the 'action'
        // property
        JSON.stringify({ action: "handshake" })
      );
    };

    connection.onmessage = (e) => {
      const msgData = JSON.parse(e.data);
      externalMsg.value = msgData.data;
    };

    return {
      connection,
      externalMsg,
    };
  },
  mounted() {
    console.log("CONNECTION :: ", this.connection);

    window.addEventListener("unload", () => {
      console.log("Websocket closing...");
      this.connection.close();
    });
  },
  beforeUnmount() {
    this.connection.close();
    this.connection.onclose = function () {
      console.log("clean up");
    };
  },
};
</script>

<style scoped lang="scss">
@import "../assets/scss/_variables.scss";
@import "../assets/scss/lscoicons.scss";
@import "../assets/scss/levi-fonts.scss";

.ws-container {
  .external-msg {
    font-family: "Helvetica-Now-Text-Regular";
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    line-height: 34px;
    width: 100%;
    text-align: center;
    margin: 10px 0;
    border: 1px solid #aae4aa;
    border-radius: 20px;
    background: #c9f6c9;
    color: blue;
  }
}
</style>