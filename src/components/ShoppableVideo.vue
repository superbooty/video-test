<template>
  <div class="shoppable-container">
    <div class="video-container aspect-169 pos-relative">
      <video
        id="video-player"
        class="video-el br-all pos-absolute"
        :poster="videoPoster"
        controls
        crossorigin="annoynymous"
        type="application/x-mpegURL"
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
    <div class="shoppable-products">
      <div v-if="codes.length < 1" class="no-products">
        <span>This video is shoppable</span>
      </div>
      <video-product-card
        v-else
        v-for="code in codes"
        :key="code"
        :code="code"
        ref="vpc`${code}`"
      >
      </video-product-card>
    </div>
    <web-socket @customCue="customCueBuilder"></web-socket>
  </div>
</template>

<script>
import VideoProductCard from "../components/shoppable/VideoProductCard.vue";
import WebSocket from "./WebSocket.vue";
import { loadScript } from "@/utils/loadScripts";

import { ref, reactive, computed } from "vue";
export default {
  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const codes = new reactive([]);

    const videoSrc = ref(null);
    const metaFileSrc = ref(null);
    const videoPoster = ref(null);
    const playerLoaded = ref(false);
    const player = ref(null);

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
        // metaFileSrc.value = data.entries[0].video_metadata_track_file.url;
      });

    // methods
    const codeSeen = (code) => {
      return codes.length > 0 ? codes.includes(code) : false;
    };

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

    return {
      videoSrc,
      metaFileSrc,
      videoPoster,
      codes,
      codeSeen,
      ivsPlayerHost,
      playerLoaded,
      player,
      customCueBuilder
    };
  },
  
  mounted() {
    
    if (!window.customElements.get("amazon-ivs-player")) {
      loadScript(
        `${this.ivsPlayerHost}/amazon-ivs-player.min.js`,
        "amazon-ivs-player"
      ).then(() => {
        this.playerLoaded = true;
        this.player = window.IVSPlayer.create();
        this.player.attachHTMLVideoElement(document.getElementById("video-player"));
        // this.player.load(
        //   "https://4da4a22026d3.us-west-2.playback.live-video.net/api/video/v1/us-west-2.298083573632.channel.hdviye1zVPxT.m3u8"
        // );
        this.player.load("https://ivs-poc-recording.s3-us-west-2.amazonaws.com/ivs/497531642140/1wZsrjIZeadM/2021-02-25T19-43-18.644Z/YXgJrTUmfxiM/media/hls/master.m3u8");
        this.player.addEventListener(window.IVSPlayer.PlayerEventType.TEXT_METADATA_CUE, (cue) => {
            console.log('Timed metadata: ', cue.text);
            const data = JSON.parse(cue.text);
            data.productIds.forEach((product) => {
              if (!this.codeSeen(product.id)) {
                this.codes.unshift(product.id);
              }
            });
        });
      });
    } else {
      this.player.load(
        "https://4da4a22026d3.us-west-2.playback.live-video.net/api/video/v1/us-west-2.298083573632.channel.hdviye1zVPxT.m3u8"
      );
    }
      
    const videoTrack = document.querySelector("track");
    videoTrack.oncuechange = (e) => {
      // get the meta text
      const meta = [...e.target.track.activeCues]
        .map((t) => t.text)
        .join(" ");
      if (meta) {
        const data = JSON.parse(meta);
        console.log(data.products);
        data.products.forEach((product) => {
          if (!this.codeSeen(product.id)) {
            this.codes.unshift(product.id);
          }
        });
      }
    };
  },
  components: {
    VideoProductCard,
    WebSocket
  },
};
</script>

<style lang="scss">
@import "../assets/scss/_variables.scss";
@import "../assets/scss/lscoicons.scss";
@import "../assets/scss/levi-fonts.scss";

.shoppable-container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-template-rows: 400px;
  height: 400px;
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
    width: 500px;
    background: black;
    video {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }
  .shoppable-products {
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
    overflow-y: auto;
    list-style-type: none;
    .no-products {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.video-el {
  width: 400px;
}
</style>
