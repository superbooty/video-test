<template>
  <div class="ws-container" ref="msgContainer">
    <transition-group name="fade" tag="ul" >
      <li v-for="(msg, index) in externalMsgs" :key="index"
        class="external-msg">
        {{ msg }}
      </li>
    </transition-group>
  </div>
  <div class="broadcaster">
    <button class="favorite styled" type="button"
      @click="broadcastMsg(message)">Broadcast Message</button>
    <input
      class="msg"
      v-model="message"
      type="text"
      placeholder="Enter a message to broadcast"
    />
  </div>
  <div class="broadcaster">
    <button class="favorite styled" type="button"
      @click="sendProducts(products)">Broadcast Products</button>
    <input
      class="msg"
      v-model="products"
      type="text"
      required
      pattern="([0-9]{9,9}|,)+"
      placeholder="Enter productIds separated by commas"
    />
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

    const externalMsgs = ref([]);
    const msgContainer = ref(null);

    const connection = new WebSocket(
      "wss://c88o2kpym0.execute-api.us-west-2.amazonaws.com/dev"
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
        externalMsgs.value.push(msgData.data);
        // scroll to bottom
        const el = msgContainer.value;
        el.scrollTop = el.scrollHeight;
      }
      // send message to parent
      if (msgData.action === "products") {
        emit("custom-cue", {productIds: msgData.data});
      }
    };

    // methods
    const sendProducts = (msg) => {
      const pattern = /^\d{9}(?:|, \d{9})+$/
        if (pattern.test(msg)) {
          const products = msg.split(',').map(item => item.trim());
          connection.send(
            // This message will be routed to 'routeA' based on the 'action'
            // property
            JSON.stringify({ action: "products", data: products})
          );
       } else {
         console.warn("input patter does not match pc9 or pc9, pc9");
       }
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
      externalMsgs,
      broadcastMsg,
      sendProducts,
      msgContainer,
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

.fade-enter-active,
.fade-leave-active {
  z-index: 1000;
  background: white;
  transition: all .200s ease-in-out;
  transform-origin: left top;
  position: relative;
  transform: scale(1);
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(0);
  background: white;
}

.ws-container {
  margin-top: 40px ;
  max-height: 250px;
  overflow-y: auto;
  ul {
    margin-bottom: 40px;
    overflow-y: auto;
  }
  .external-msg {
    font-family: "Helvetica-Now-Text-Regular";
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    text-indent: 15px;
    line-height: 38px;
    width: 50%;
    height: 40px;
    margin: 10px 0;
    border: 1px solid #c0c0c0;
    border-radius: 20px;
    background: #2d2d2d;
    color: white;
  }
}
.broadcaster {
    margin: 10px 0;
    .msg {
      min-width: 400px;
      line-height: 32px;
      margin: 0 10px;
      font-size: 15px;
      text-indent: 5px;
      &::placeholder {
        color: #7c7c7c;
        font-size: 14px;
      }
    }
    .styled {
        border: 0;
        min-width: 150px;
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
</style>