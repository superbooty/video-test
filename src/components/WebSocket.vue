<template>
  <div class="comm-container">
    <div class="broadcaster">
      <div class="msg-type">
        <ul class="msg-type-list">
          <li>
            <svg @click="showImages = !showImages"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 14.378l-5.641 5.64c-.654.655-1.513.982-2.374.982-2.972 0-4.493-3.613-2.374-5.731l5.539-5.54c.488-.486 1.126-.729 1.766-.729 1.494 0 2.498 1.233 2.498 2.519 0 .61-.227 1.232-.734 1.74l-4.918 4.918c-.634.634-1.665.634-2.299 0-.633-.633-.633-1.664 0-2.298l3.971-3.97.828.828-3.971 3.97c-.178.177-.178.466 0 .643s.465.177.643 0l4.919-4.918c.517-.517.517-1.357 0-1.874-.517-.517-1.356-.517-1.874 0l-5.539 5.54c-.854.853-.854 2.241 0 3.093.852.853 2.24.853 3.093 0l5.64-5.64.827.827zm-17-5.878c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5c0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5zm7.57 3.013l-1.57-2.513-2.52 4-2.48-1.96-4 5.96h6.694c.144-1.139.63-2.242 1.503-3.114l2.373-2.373zm-3.754 7.487h-8.816v-14h18v2.126c.299-.062.604-.096.916-.096.371 0 .732.06 1.084.147v-4.177h-22v18h11.818c-.482-.605-.818-1.283-1.002-2z"/></svg>
          </li>
          <li :class="{'selected': productComposition}">
            <svg @click="toggleProductComposition" width="24" height="24"
              xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.722 19.994l2.185-3 .808.589-2.185 3-.808-.589zm6.415-3l2.185 3-.809.589-2.185-3 .809-.589zm-2.135-13.5c-.884 0-1.521-.151-1.833-.285.312-.133.949-.284 1.833-.284s1.521.151 1.833.284c-.312.134-.949.285-1.833.285m6.008 10.255l-.971.167-.016 9.084h-4.512v-18.522c1.242-.075 2.491-.435 2.491-1.269 0-.948-1.616-1.284-3-1.284s-3 .336-3 1.284c0 .838 1.261 1.197 2.509 1.27v18.521h-4.511l.017-9.082-.97-.171-2.867 7.937-1.968-.47 3.557-14.595 4.277-1.703c-1.041-.922-1.229-1.666-1.175-2.14.185-1.62 3.155-1.776 4.129-1.776.974 0 4.02.258 4.146 1.81.039.472-.047 1.184-1.236 2.078l4.343 1.731 3.54 14.597-1.952.474-2.831-7.941zm2.093-7.868l-3.432-1.368c.344-.533.522-1.179.472-1.785-.226-2.718-4.959-2.728-5.134-2.728-3.863.015-5.021 1.695-5.132 2.662-.067.593.115 1.249.497 1.843l-3.454 1.376-3.917 16.071 3.814.912 2.195-6.075-.014 7.211h12.023l.014-7.206 2.167 6.082 3.798-.926-3.897-16.069z"/></svg>
          </li>
          <li :class="{'selected': !productComposition}">
            <svg @click="productComposition = false"
              xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22 7v10h-20v-10h20zm2-2h-24v14h24v-14zm-18 3h-3v2h3v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2zm-4 6h-10v2h10v-2zm4-3h-4v2h4v-2zm-14 0h-4v2h4v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2zm3 0h-2v2h2v-2z"/></svg>
          </li>
        </ul> 
      </div>
      <div class="text-img-msg">
        <label :class="{'products': productComposition}"></label>
        <input
          class="msg txt-input"
          v-model="message"
          ref="messageInput"
          :pattern="inputPattern"
          type="text"
          required
          placeholder="Enter a message to broadcast"
          @input="inputHandler"
        />
      </div>
      <!-- <div class="condition"> or </div>
      <div class="text-img-msg">
        <label>products</label>
        <input
          class="msg"
          v-model="products"
          ref="productsInput"
          type="text"
          required
          pattern="^\d{9}(?:|, \d{9})+$"
          placeholder="Enter productIds separated by commas"
          @input="inputHandler"
        />
      </div> -->
      <button class="favorite styled" type="button"
        @click="sendMsg">Send </button>
      <div class="img-picker" :class="{'on': showImages}">
        <ul>
          <li v-for="id in productIds" :key="`p.id.${id}`">
            <img :src="`https://lsco.scene7.com/is/image/lsco/${id}-front-pdp?$qv_desktop_bottoms$`" 
              @click="sendImg(id)"
            />
          </li>
        </ul>
      </div>
    </div>
    <div class="ws-container" ref="msgContainer">
      <transition-group name="fade" tag="ul" >
        <li v-for="(msg, index) in messages" 
        :key="`r-${index}`"
        :class="{'msg-line': true, 'in': msg.type === 'in'}"
        >
          <span v-if="msg.type === 'in'" class="external-msg in">
            <img v-if="msg.img" :src="msg.img" class="msg-img" @load="scrollMsgList"/>
            <span>{{msg.msg}}</span>
          </span>
          <span v-else class="external-msg out">
            <span class="msg-sender">{{msg.sender}}</span>
            <picture v-if="msg.img" @load="scrollMsgList" class="msg-img">
              <source :src="msg.img" type="image/webp">
              <source :src="msg.img" type="image/jpeg"> 
              <img :src="msg.img" alt="Alt Text!">
            </picture>
            <span>{{msg.msg}}</span>
          </span>
        </li>
      </transition-group>
    </div>
  </div>
  <div class="test-products" :class="{'on': showTestIds }">
    <span @click="showTestIds = !showTestIds">test product ids</span>
    <div class="tops">
      <b>tops:</b> 196980006, 197060006, 287880003, 287880004, 196950008, 197540002, 197540003
    </div>
    <div class="bottoms">
      <b>bottoms:</b> 278890002, 188810412, 188820445, 196260276, 349640112, 177800038, 188810052
    </div>
  </div>
</template>

<script>

import { ref, nextTick} from "vue";
import userState from "@/state/userState";

export default {
  props: {
    code: String,
  },

  setup(props, {emit}) {
    console.log("Item Selector PROPS :: ", props);

    const messages = ref([]);
    const msgContainer = ref(null);
    const messageInput = ref(null);
    const showTestIds = ref(false);
    const receivedImg = ref(null);
    const productsInput = ref(null);
    const message = ref("");
    // const products = ref("");
    const showImages = ref(false);
    const productIds = ref([278890002, 188810412, 188820445, 196260276, 349640112, 177800038, 188810052,
          196980006, 197060006, 287880003, 287880004, 196950008, 197540002, 197540003]);

    const { state } = userState();
    const productComposition = ref(false);

    const connection = new WebSocket(
      "wss://c88o2kpym0.execute-api.us-west-2.amazonaws.com/dev"
    );

    connection.onopen = function () {
      const email = state.value.email;
      if (email) {
        this.send(
          // This message will be routed to 'routeA' based on the 'action'
          // property
          JSON.stringify({ action: "handshake", email})
        );
      }
    };

    connection.onmessage = (e) => {
      const msgData = JSON.parse(e.data);
      if (msgData.action === "message") {
        messages.value.push({type: "out" ,msg: msgData.data, sender: msgData.sender});
        // scroll to bottom
        scrollMsgList();
      }
      // send message to parent
      if (msgData.action === "products") {
        emit("custom-cue", {productIds: msgData.data});
      }
      if (msgData.action === "img") {
        messages.value.push({type: "out" ,img: msgData.img, sender: msgData.sender, msg: msgData.msg});
        scrollMsgList();
      }
    };

    // methods
    const toggleProductComposition = () => {
      productComposition.value = !productComposition.value;
    }

    const sendProducts = (msg) => {
      // const pattern = /^\d{9}(?:|, \d{9})+$/
      const el = messageInput.value;
      el.pattern="^\\d{9}(?:|, \\d{9})+$";
      if (el.checkValidity()) {
        let prodList = msg.split(',').map(item => item.trim());
        // remove dups
        prodList = [...new Set(prodList)];
        connection.send(
          // This message will be routed to 'routeA' based on the 'action'
          // property
          JSON.stringify({ action: "products", data: prodList})
        );
        emit("add-to-bucket", {productIds: prodList});
        message.value = "";
       } else {
         el.setCustomValidity("Input pattern does not match pc9 or pc9, pc9...");
         el.reportValidity();
         console.warn("input patter does not match pc9 or pc9, pc9");
       }
    };

    const inputHandler = () => {
        console.log("changed...");
        const productsEl = messageInput.value;
        productsEl.setCustomValidity("");
    };

    const broadcastMsg = (msg) => {
      const el = messageInput.value;
      el.pattern=".*";
      if (el.checkValidity())  {
        const sender = state.value.userName;
        connection.send(
          // This message will be routed to 'routeA' based on the 'action'
          // property
          JSON.stringify({ action: "message", data: msg, sender })
        );
        messages.value.push({type: "in", msg});
        message.value = "";
        scrollMsgList();
      } else {
        el.reportValidity();
      }
    };

    const sendMsg = () => {
      if (message.value && productComposition.value) {
        sendProducts(message.value);
      } else {
        // clear the old validation message if it was set to product
        inputHandler();
        broadcastMsg(message.value);
      }
      console.log("Sending Msg...");
    };

    const sendImg = (id) => {
      toDataURL(`https://lsco.scene7.com/is/image/lsco/${id}-front-pdp?$qv_desktop_bottoms$`)
      .then(dataUrl => {
        console.log('RESULT:', dataUrl);
        messages.value.push({type: "in", img: dataUrl});
        const sender = state.value.userName;
        connection.send(JSON.stringify({ action: "img", img: dataUrl, sender, msg: `pc9: ${id}` }));
        scrollMsgList();
      });
    }

    const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }));

    const scrollMsgList = async () => {
      const el = msgContainer.value;
      await nextTick(() => {
        el.scrollTop = el.scrollHeight;
      })
    }

    return {
      connection,
      messages,
      msgContainer,
      messageInput,
      productsInput,
      inputHandler,
      sendMsg,
      message,
      sendImg,
      receivedImg,
      showImages,
      productIds,
      showTestIds,
      toggleProductComposition,
      productComposition
    };
  },

  components: {
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

.spacer {
  height: 10px;
}

.test-products {
  position: absolute;
  top: 0px;
  right: 0px;
  color: #a8a8a8;
  padding: 0 10px;
  max-width: 200px;
  max-height: 30px;
  overflow: hidden;
  text-align: left;
  span {
    display: block;
    border-bottom: 3px solid green;
    text-align: left;
    font-size: 12px;
    letter-spacing: 1.5px;
    font-weight: bolder;
    line-height: 26px;
    text-align: center;
    &::after {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000000' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E");
      position: absolute;
    }
  }
  &.on {
    max-height: 400px;
  }
  .tops, .bottoms {
    font-size: 12px;
    margin: 0 0 10px 0;
  }
}

.comm-container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: 10px;
  justify-content: center;
  .broadcaster {
      flex-basis: 30vw;
      min-width: 476px;
      margin: 0 0 40px 0;
      text-align: left;
      position: relative;
      // display: grid;
      // grid-template-columns: 150px 1fr;
      // grid-row-gap: 10px;
      .img-picker {
        position: absolute;
        top: 24px;
        left: 0px;
        max-width: 0px;
        background: white;
        transition: max-width .250s ease-in;
        &.on {
          padding: 0 10px;
          border: 1px solid #e6e6e6;
          @media (max-width: 508px) {
            max-width: calc(100% - 18px);
          }
          max-width: 460px;
        }
        ul {
          display: flex;
          padding: 0;
          margin: 5px;
          list-style-type: none;
          overflow-y: auto;
          li {
            margin: 0 5px;
            width: 60px;
            flex: 0 0 auto;
            img {
              height: 100%;
              width: 100%;
              object-fit: contain;
            }
          }
        }
      }
      .text-img-msg {
        label {
          letter-spacing: 1.2px;;
          &.products {
            &::after {
              content: "products";
            }
          }
          &::after {
            content: "text";
          }
        }
        margin-top: 10px;
        position: relative;
      }
      .msg-type {
        margin: auto 0;
        .msg-type-list {
          li {
            &.selected {
              border: 2px solid red;
            }
            padding: 4px;
            display: inline-block;
            margin-right: 10px;
            height: 26px;
            width: 26px;
            border: 2px solid #e8e8e8;
            border-radius: 24px;
          }
          list-style: none;
          padding: 0px;
          margin: 10px 0 0;
        }
      }
      label {
        position: absolute;
        top: -10px;
        padding: 3px 5px;
        font-size: 12px;
        background: white;
        max-width: 90px;
        text-align: center;
        color: #74acff;
        left: 10px;
      }
      .msg {
        min-width: calc(100% - 4px);
        line-height: 38px;
        font-size: 14px;
        text-indent: 5px;
        &::placeholder {
          color: #b8b7b7;
          font-size: 14px;
        }
      }
      .condition {
        position: absolute;
        width: 100%;
        line-height: 24px;
        font-size: 12px;
        text-align: center;
      }
      .styled {
          border: 0;
          background: none;
          line-height: 30px;
          font-size: 12px;
          text-align: center;
          color: #5a9dff;
          position: ABSOLUTE;
          width: 50px;
          outline: none;
          top: 104px;
          right: 10px;
          // text-shadow: 1px 1px 1px #000;
          // border-radius: 10px;
          // background-color: rgba(220, 0, 0, 1);
          // background-image: linear-gradient(
          // to top left,
          // rgba(0, 0, 0, 0.2),
          // rgba(0, 0, 0, 0.2) 30%,
          // rgba(0, 0, 0, 0)
          // );
          // box-shadow: inset 2px 2px 3px rgba(255, 255, 255, 0.6),
          // inset -2px -2px 3px rgba(0, 0, 0, 0.6);
          &:active {
            transform: scale(1.2);
          }
          &::after {
            // content: url("data:image/svg+xml, %3Csvg id='fi_3814305' enable-background='new 0 0 14 14' height='14' viewBox='0 0 512 512' width='14' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' data-v-3474b467=''%3E%3ClinearGradient id='SVGID_1_' gradientUnits='userSpaceOnUse' x1='302.017' x2='302.017' y1='511.999' y2='.001' data-v-3474b467=''%3E%3Cstop offset='0' stop-color='%235558ff' data-v-3474b467=''%3E%3C/stop%3E%3Cstop offset='1' stop-color='%2300c0ff' data-v-3474b467=''%3E%3C/stop%3E%3C/linearGradient%3E%3ClinearGradient id='SVGID_2_' gradientUnits='userSpaceOnUse' x1='196' x2='196' y1='331.001' y2='181.001' data-v-3474b467=''%3E%3Cstop offset='0' stop-color='%23addcff' data-v-3474b467=''%3E%3C/stop%3E%3Cstop offset='.5028' stop-color='%23eaf6ff' data-v-3474b467=''%3E%3C/stop%3E%3Cstop offset='1' stop-color='%23eaf6ff' data-v-3474b467=''%3E%3C/stop%3E%3C/linearGradient%3E%3Cg data-v-3474b467=''%3E%3Cg data-v-3474b467=''%3E%3Cg data-v-3474b467=''%3E%3Cpath d='m504.8 243.101-390-240.958c-5.4-3.3-12.301-2.701-17.401 1.199-4.799 4.2-6.599 11.1-4.499 17.1l82.5 220.558 126.599 15-126.599 15-82.5 220.6c-2.1 6-.3 12.9 4.499 17.1 5.005 3.892 12.278 4.399 17.401 1.199l390-241c4.499-2.999 7.2-7.8 7.2-12.9 0-5.097-2.701-9.898-7.2-12.898z' fill='url(%23SVGID_1_)' data-v-3474b467=''%3E%3C/path%3E%3C/g%3E%3C/g%3E%3Cg data-v-3474b467=''%3E%3Cg data-v-3474b467=''%3E%3Cpath d='m377 241.001h-201.599l5.698 15-5.698 15h201.599c8.401 0 15-6.599 15-15s-6.599-15-15-15zm-270 0h-92c-8.291 0-15 6.709-15 15s6.709 15 15 15h92c8.291 0 15-6.709 15-15s-6.709-15-15-15zm-30 60h-62c-8.291 0-15 6.709-15 15s6.709 15 15 15h62c8.291 0 15-6.709 15-15s-6.709-15-15-15zm-62-90h62c8.291 0 15-6.709 15-15s-6.709-15-15-15h-62c-8.291 0-15 6.709-15 15s6.709 15 15 15z' fill='url(%23SVGID_2_)' data-v-3474b467=''%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E%0A");
            content: url("data:image/svg+xml,%3Csvg version='1.1' id='fi_60525' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='30' height='24' viewBox='0 0 535.5 535.5' style='fill:%2384DBFF; background:new 0 0 535.5 535.5;' xml:space='preserve'%3E%3Cg%3E%3Cg id='send'%3E%3Cpolygon points='0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 '%3E%3C/polygon%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E");
            width: 26px;
            height: 24px;
            position: absolute;
            transform: translateY(-50%);
            top: 50%;
            display: inline-block;
          }
      }
      .styled:hover {
          // background-color: rgba(255, 0, 0, 1);
      }
    }
    .ws-container {
      flex-basis: 48vw;
      max-height: 350px;
      min-width: 476px;
      overflow-y: auto;
      ul {
        // margin-bottom: 40px;
        padding: 0;
        text-align: left;
        list-style-type: none;
        li {
          position: relative;
          clear: both;
          display: grid;
          justify-content: left;
          &.in {
            text-align: left;
            justify-content: end;
          }
        }
      }
      .external-msg {
        font-family: "Helvetica-Now-Text-Regular";
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        line-height: 18px;
        max-width: 300px;
        min-width: 110px;
        overflow-wrap: break-word;
        margin: 10px 0;
        border: 1px solid #6462620a;
        border-radius: 7px;
        background: #dadada;
        color: #503d3d;
        padding: 10px 10px;
        list-style: none;
        position: relative;
        display: inline-block;
        span {
          display: block;
          font-size: 13px;
        }
        .msg-sender {
          position: absolute;
          top: 3px;
          font-family: arial, sans-serif;
          color: #cc0402;
          font-size: 11px;
          font-weight: 800;
        }
        img {
          border-radius: 10px;
          height: 120px;
          margin: 0 auto;
          display: block;
        }
        &.out {
          left: 20px;
          padding: 20px 10px 5px 10px;
          &::before {
            content: '';
            width: 0;
            height: 0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-right: 10px solid #dadada;
            position: absolute;
            left: -10px;
            top: 10px;
          }
        }
        &.in {
          background: #447dff;
          right: 10px;
          color: white;
          &::after {
            content: '';
            width: 0;
            height: 0;
            border-top: 7px solid transparent;
            border-bottom: 7px solid transparent;
            border-left: 10px solid #457dff;
            right: -10px;
            top: 10px;
            position: absolute;
            clear: both;
          }
        }
      }
    }
    @media (max-width: 508px) {
      .broadcaster, .ws-container {
        min-width: 100%;
      }
    }
  }
</style>
