<template>
  <div class="shoppable-container">
    <div class="video-container aspect-169 pos-relative">
      <video
        ref="videoPlayer"
        class="video-el br-all pos-absolute"
        playsinline
        crossorigin
        controls="controls"
        preload="none"
        :poster="videoPoster"
      >
        <!-- <source v-if="videoSrc" :src="videoSrc" /> -->
        <track
          id="trk"
          default
          kind="metadata"
          :src="metaFileSrc"
          srclang="en"
          label="Key Stage 2"
        />
      </video>
      <div class="admin-console" @click="toggleAdmin()">admin</div>
    </div>
    <div id="shoppy" class="shoppable-products" ref="shoppableList">
      <div v-if="!productCollection" class="no-products">
        <span>This video is shoppable</span>
      </div>
      <transition-group v-else name="shuffle" tag="ul">
        <li v-for="collection in productCollection"
          class="product-group" 
          :key="collection.hash">
          <ul >
            <li v-for="code in collection.products" :key="code">
              <video-product-card
                :code="code"
                :ref="`vpc${code}`"
                @open-modal="openModal">
              </video-product-card>
            </li>
          </ul>
        </li>
      </transition-group>
    </div>
    <add-to-bag-modal v-if="atcCode" :code="atcCode" @close-modal="closeModal"/>
  </div>
  <web-socket v-if="showAdmin" @customCue="customCueBuilder"></web-socket>
</template>

<script>
import VideoProductCard from "../components/shoppable/VideoProductCard.vue";
import WebSocket from "./WebSocket.vue";
import { loadScript } from "@/utils/loadScripts";
import md5 from 'crypto-js/md5';
const AddToBagModal = defineAsyncComponent(
  () => import('../components/shoppable/AddToBagModal.vue')
);

import { ref, computed, onMounted, defineAsyncComponent} from "vue";
export default {
  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const scrollItemToView = ref(null);
    const videoPlayer = ref(null);
    const productCollection = ref([]);
    const videoSrc = ref(null);
    const metaFileSrc = ref(null);
    const videoPoster = ref(null);
    const player = ref(null);
    const shoppableList = ref(null);
    const showAdmin = ref(false);
    const atcCode = ref(null);

    const url =
      "https://cdn.contentstack.io/v3/content_types/module_video_stream_shoppable_v1/entries?environment=example&uid=blt56bc1514958aa740";
    const options = {
      method: "GET",
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "content-type": "application/json",
        api_key: "blta74051ed59d33def",
        access_token: "cs48aa4fb094e77b43fcea00e2",
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    };

    fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // videoSrc.value = data.entries[0].video_url;
        videoPoster.value = data.entries[0].video_poster_url;
        metaFileSrc.value = data.entries[0].video_metadata_track_file.url;
      });

    // methods
    const codeSeen = (collectionId) => {
      return productCollection.value.find(el => {
        return el.hash === collectionId;
      });
    };

    const toggleAdmin = () => {
      showAdmin.value = !showAdmin.value;
    }

    const openModal = (code) => {
      console.log("CALLED OPEN MODAL :: ", code);
      atcCode.value = code;
    }

    const closeModal = () => {
      console.log("CALLED CLOSE MODAL");
      atcCode.value = null;
    }

    const processCodeEntries = (collectionId) => {
      const found = productCollection.value.find(el => {
        return el.hash === collectionId;
      });
      productCollection.value = productCollection.value.filter(el => {
        return el.hash !== collectionId;
      });
      productCollection.value.unshift(found);
      
      // codes.value = codes.value.filter(code => code !== product);
      // codes.value.unshift(product);
      // console.log('MESSED :: ', codes);
    }

    const playVideo = () => {
      player.value.load(
        "https://d39rhsn6wdjbch.cloudfront.net/ivs/497531642140/1wZsrjIZeadM/2021-03-04T02-14-12.142Z/AOflm4FcCEN5/media/hls/master.m3u8"
      );
    }

    const customCueBuilder = (val) => {
      if (player.value) {
        player.value.core.emitter.emit("PlayerTextMetadataCue", {
            description: "",
            endTime: 2.37615555555556,
            startTime: 1.37615555555556,
            text: JSON.stringify({ productIds: val.productIds }),
            type: "TextMetadataCue"
        });
      }
    };

    // computed
    const ivsPlayerHost = computed(() => {
      return process.env.VUE_APP_IVS_PLAYER;
    });

    // hooks
    onMounted(() => {
      if (!window.customElements.get("amazon-ivs-player")) {
        loadScript(
          `${ivsPlayerHost.value}/amazon-ivs-player.min.js`,
          "amazon-ivs-player"
        ).then(() => {
          if (window.IVSPlayer.isPlayerSupported) {
            player.value = window.IVSPlayer.create();
            player.value.attachHTMLVideoElement(videoPlayer.value);
            playVideo();
            player.value.addEventListener(window.IVSPlayer.PlayerEventType.TEXT_METADATA_CUE, (cue) => {
                console.log('Timed metadata: ', cue.text);
                const data = JSON.parse(cue.text);
                const productsHash = md5(data.productIds.toString()).toString();
                const productColl = {hash: productsHash, products: data.productIds};
                // check if the hash is in collections array
                if (!productCollection.value.some(e => e.hash === productsHash)) {
                  productCollection.value.unshift(productColl);
                } else {
                  processCodeEntries(productsHash);
                  const el = shoppableList.value;
                  el.scrollTop = 0;
                }
                console.log("COLLECTION :: ", productCollection.value);
            });
            player.value.addEventListener(window.IVSPlayer.PlayerState.PLAYING, function () {
                console.log("Player State - PLAYING");
            });
          }
        });
      } else {
        playVideo();
      }
        
      const videoTrack = document.querySelector("track");
      videoTrack.oncuechange = (e) => {
        // get the meta text
        const meta = [...e.target.track.activeCues]
          .map((t) => t.text)
          .join(" ");
        if (meta) {
          const data = JSON.parse(meta);
          const productsHash = md5(data.products.toString()).toString();
          const productColl = {hash: productsHash, products: data.products};
          // check if the hash is in collections array
          if (!productCollection.value.some(e => e.hash === productsHash)) {
            productCollection.value.unshift(productColl);
          } else {
            processCodeEntries(productsHash);
            const el = shoppableList.value;
            el.scrollTop = 0;
          }
        }
      };
    });

    return {
      videoSrc,
      metaFileSrc,
      videoPoster,
      productCollection,
      codeSeen,
      ivsPlayerHost,
      player,
      customCueBuilder,
      scrollItemToView,
      playVideo,
      shoppableList,
      videoPlayer,
      toggleAdmin,
      showAdmin,
      atcCode,
      openModal,
      closeModal
    };
  },
  
  
  components: {
    VideoProductCard,
    WebSocket,
    AddToBagModal
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
@import "../assets/scss/lscoicons.scss";
@import "../assets/scss/levi-fonts.scss";

.shuffle-move {
  transition: transform 1s;
}

.shoppable-container {
    box-sizing: border-box;
    display: flex;
    flex: 0 1 auto;
    flex-direction: row;
    position: relative;
    height: 400px;
  .admin-console {
    position: relative;
    top: -6px;
    left: 7px;
    line-height: 26px;
    width: 100px;
    background: #adadad;
    color: white;
    font-size: 12px;
    // End
    &:after {
      position: absolute;
      z-index: -1;
      content: "";
      right: -5%;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: inherit;
      -webkit-transform: skewX(-10deg);
      -moz-transform: skewX(-10deg);
      -ms-transform: skewX(-10deg);
      transform: skewX(-10deg);
    }
    &:before {
      z-index: -1;
      content: "";
      position: absolute;
      left: -5%;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: inherit;
      -webkit-transform: skewX(10deg);
      -moz-transform: skewX(10deg);
      -ms-transform: skewX(10deg);
      transform: skewX(10deg);
    }
  }
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
  .video-container {
    flex: 0 0 auto;
    flex-basis: 56vw;
    width: 56vw;
    background: black;
    video {
      object-fit: cover;
      width: 100%;
      height: 100%;
      object-position: top;
    }
    .poster {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 56vw;
      height: 100%;
      background-position: center;
    }
  }
  .shoppable-products {
    flex: 0 0 auto;
    flex-basis: 24vw;
    overflow-y: auto;
    width: 24vw;
    height: 100%;
    .product-group {
      &:nth-child(1) {
        margin: 0;
        border-left: 2px solid red;
      }
      ul {
        margin: 0;
      }
      margin: 25px 0;
      box-shadow: 13px 4px 10px 0px #f4f4f4;
    }
    ul {
      margin: 10px;
      padding: 0;
      list-style-type: none;
    }
    .no-products {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-transform: uppercase;
      font-weight: 600;
      font-family: sans-serif;
    }
  }
}

.video-el {
  width: 400px;
}
</style>
