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
        loop
        type="video/mp4"
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
    </div>
    <div id="shoppy" class="shoppable-products" >
      <div v-if="!productCollection" class="no-products">
        <span>This video is shoppable</span>
      </div>
      <div v-else class="group-scroll" ref="shoppableList">
        <transition-group name="shuffle" tag="ul">
          <li v-for="collection in productCollection"
            class="product-group" 
            :key="collection.hash">
            <ul>
              <li v-for="(code, index) in collection.products" :key="code">
                <video-product-card
                  :code="code"
                  :ref="`vpc${code}`"
                  :separator="index > 0"
                  @open-modal="openModal">
                </video-product-card>
              </li>
            </ul>
          </li>
        </transition-group>
      </div>
    </div>
    <add-to-bag-modal v-if="atcCode" :code="atcCode" @close-modal="closeModal"/>
  </div>
  <web-socket v-if="state.showMsgConsole" @customCue="customCueBuilder" @addToBucket="addToBucket"></web-socket>
</template>

<script>
import VideoProductCard from "../components/shoppable/VideoProductCard.vue";
import WebSocket from "./WebSocket.vue";
import { loadScript } from "@/utils/loadScripts";
import md5 from 'crypto-js/md5';
import {appState} from "@/state/appState";

const AddToBagModal = defineAsyncComponent(
  () => import('../components/shoppable/AddToBagModal.vue')
);

import { ref, computed, onMounted, watch, defineAsyncComponent } from "vue";
export default {
  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const { state } = appState();

    const scrollItemToView = ref(null);
    const videoPlayer = ref(null);
    const productCollection = ref([]);
    const videoSrc = ref(null);
    const metaFileSrc = ref(null);
    const videoPoster = ref(null);
    const player = ref(null);
    const shoppableList = ref(null);
    const atcCode = ref(null);
    const vttTrack = ref({});

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

    // fetch(url, options)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((data) => {
    //     videoSrc.value = data.entries[0].video_url;
    //     videoPoster.value = data.entries[0].video_poster_url;
    //     metaFileSrc.value = data.entries[0].video_metadata_track_file.url;
    //   });

    Promise.all([
      fetch(url, options),
      fetch('/video-meta/meta.json')
      ]).then(function (responses) {
        // Get a JSON object from each of the responses
        return Promise.all(responses.map(function (response) {
          return response.json();
        }));
      }).then(function (data) {
        // data is an array of the two fetches
        // first is the video data
        const vidData = data[0];
        vttTrack.value = data[1];
        videoSrc.value = vidData.entries[0].video_url;
        videoPoster.value = vidData.entries[0].video_poster_url;
        metaFileSrc.value = vidData.entries[0].video_metadata_track_file.url;
        console.log(vttTrack.value);
        // const videoTrack = document.querySelector("track");
      }).catch(function (error) {
        console.log(error);
      });
    
    // methods
    const codeSeen = (collectionId) => {
      return productCollection.value.find(el => {
        return el.hash === collectionId;
      });
    };

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

    const addToBucket = (val) => {
      const data = {products: val.productIds};
      const productsHash = md5(data.products.toString()).toString();
      const productColl = { hash: productsHash, products: data.products };
      if (!productCollection.value.some((e) => e.hash === productsHash)) {
        productCollection.value.unshift(productColl);
      } else {
          const found = productCollection.value.find((el) => {
          return el.hash === productsHash;
        });
        productCollection.value = productCollection.value.filter((el) => {
          return el.hash !== productsHash;
        });
        productCollection.value.unshift(found);
      }
      const el = shoppableList.value
      el.scrollTop = 0;
    }

    const playVideo = () => {
      // player.value.load(
      //   "https://assets.contentstack.io/v3/assets/bltab687eb09ed92451/blt0516a2ddf86d32f7/60256c5f5f9b2812764c3de9/levisSeasonalSample.mp4"
      // );
      console.log("SRC :: ", videoSrc.value);
      player.value.load(videoSrc.value);
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

    // watchers
    watch(videoSrc, () => {
      console.log("VIDEO SRC :: ", videoSrc.value);
      if (player.value)
        playVideo();
    });

    watch(vttTrack, () => {
      let video = document.querySelector('video');
      const {vttType, vttCues} = vttTrack.value;
      const track = video.addTextTrack(vttType);
      vttCues.forEach(cue => {
        const newCue = new VTTCue(cue.startTime, cue.endTime, JSON.stringify(cue.text));
        track.addCue(newCue);
      });
      // handle the cue change
      track.oncuechange = (e) => {
        console.log(e);
        // get the meta text
        const meta = [...e.target.activeCues]
          .map((t) => t.text)
          .join(" ");
        if (meta) {
          const data = JSON.parse(meta);
          const productsHash = md5(data.toString()).toString();
          const productColl = {hash: productsHash, products: data};
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
      atcCode,
      openModal,
      closeModal,
      addToBucket,
      state
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

.admin-console {
  position: relative;
  left: 10px;
  width: 130px;
  background: #000000;
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
    transform: skewX(10deg);
  }
  .menu-expander {
    height: 20px;
    transition-duration: .250s;
    &.opened {
      transform: rotate(180deg);
      transition-duration: .250s;
    }
    &:after {
      content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' height='24' viewBox='0 0 24 24' width='24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z'/%3E%3C/svg%3E");
      transition-property: transform;
      transform-origin: 22px 14px;
      transition-duration: .250s;
    }
  }
}

.shoppable-container {
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  flex-direction: row;
  flex-wrap: wrap;
  position: relative;
  max-height: 840px;
  justify-content: center;
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
    flex-basis: 48vw;
    height: 400px;
    min-width: 476px;
    background: black;
    video {
      object-fit: cover;
      width: 100%;
      height: 100%;
      outline: none;
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
    display: flex;
    width: 30vw;
    max-height: 400px;
    min-width: 476px;
    justify-content: center;
    background: black;
    // position: relative;
    // left: -340px;
    .group-scroll {
      overflow-y: auto;
      margin: 8px 0;
    }
    .product-group {
      &:nth-child(1) {
        margin: 0 15px 10px 10px;
        background: #ffffff;
        border-left: 4px solid #ff0101;
      }
      ul {
        margin: 0;
        li {
          padding: 3px;
        }
      }
      min-width: 360px;
      margin: 25px 15px 10px 10px;
      background: #ffffff;
      border-left: 4px solid #cfcfcf;
      box-shadow: 6px 6px 2px 0px #bdbdbd;
      @media (max-width: 508px) {
        min-width: 70vw;
      }
    }
    ul {
      margin: 0;
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
  @media (max-width: 508px) {
    .video-container, .shoppable-products {
      min-width: 100%;
    }
  }
}

.video-el {
  width: 400px;
}
</style>
