<template>
  <div class="ws-container">
    <div v-if="externalMsg" class="external-msg">{{ externalMsg }}</div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    code: String,
  },

  setup(props, {emit}) {
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
      if (msgData.action === "message") {
        externalMsg.value = (msgData.data) ? msgData.data : "";
      }
      // send message to parent
      if (msgData.action === "products") {
        emit("custom-cue", {productIds: msgData.data});
      }
    };

    // methods
    const sendProducts = (msg) => {
       const products = msg.split(',').map(item => item.trim())
       connection.send(
        // This message will be routed to 'routeA' based on the 'action'
        // property
        JSON.stringify({ action: "products", data: products})
      );
    };

    const broadcastMsg = (msg) => {
       connection.send(
        // This message will be routed to 'routeA' based on the 'action'
        // property
        JSON.stringify({ action: "message", data: msg})
      );
    };

    return {
      connection,
      externalMsg,
      broadcastMsg,
      sendProducts
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
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    text-indent: 15px;
    line-height: 38px;
    width: 100%;
    margin: 10px 0;
    border: 1px solid #959895;
    border-radius: 20px;
    background: #2d2d2d;
    color: white;
  }
  .msg {
    width: 300px;
    line-height: 32px;
    margin: 0 10px;
    font-size: 15px;
  }
  .broadcaster {
    margin: 10px 0;
    .styled {
        border: 0;
        width: 150px;
        line-height: 42px;
        font-size: 14px;
        text-align: center;
        color: #fff;
        text-shadow: 1px 1px 1px #000;
        border-radius: 10px;
        background-color: rgba(220, 0, 0, 1);
        background-image: linear-gradient(
        to top left,
        rgba(0, 0, 0, 0.2),
        rgba(0, 0, 0, 0.2) 30%,
        rgba(0, 0, 0, 0)
        );
        box-shadow: inset 2px 2px 3px rgba(255, 255, 255, 0.6),
        inset -2px -2px 3px rgba(0, 0, 0, 0.6);
    }

    .styled:hover {
        background-color: rgba(255, 0, 0, 1);
    }

    .styled:active {
        box-shadow: inset -2px -2px 3px rgba(255, 255, 255, 0.6),
        inset 2px 2px 3px rgba(0, 0, 0, 0.6);
    }
  }
}
</style>