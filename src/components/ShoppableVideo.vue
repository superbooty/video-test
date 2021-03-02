<template>
  <div class="shoppable-container">
    <div class="video-container aspect-169 pos-relative">
      <video class="video-el br-all pos-absolute"
        :poster="videoPoster"
        controls autoplay
        crossorigin="annoynymous"
        >
        <source v-if="videoSrc" :src="videoSrc" />
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
        <video-product-card  v-else v-for="code in codes"
          :key="code" :code="code" ref="vpc`${code}`">
        </video-product-card>
    </div>
  </div>
</template>

<script>
import VideoProductCard from "../components/shoppable/VideoProductCard.vue";

import { ref, reactive } from "vue";
export default {
  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const codes = new reactive([]);

    const videoSrc = ref(null);
    const metaFileSrc = ref(null);
    const videoPoster = ref(null);

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
    
    fetch(url, options).then(response => {
        return response.json();
      }).then(data => {
        videoSrc.value = data.entries[0].video_url;
        videoPoster.value = data.entries[0].video_poster_url;
        metaFileSrc.value = data.entries[0].video_metadata_track_file.url;
      });

    // methods
    const codeSeen = (code) => {
      return codes.length > 0 ? codes.includes(code) : false;
    }

    var connection = new WebSocket('wss://e8nblavjl9.execute-api.us-west-2.amazonaws.com/dev');

    return {
      videoSrc,
      metaFileSrc,
      videoPoster,
      codes,
      codeSeen,
      connection
    };
  },
  beforeUnmount() {
    this.connection.close();
    this.connection.onclose = function () {
      console.log("clean up");
    };
  },
  mounted() {
    const videoTrack = document.querySelector("track");
    videoTrack.oncuechange = (e) => {
      // get the meta text
      const meta = [...e.target.track.activeCues].map((t) => t.text).join(" ");
      if (meta) {
        const data = JSON.parse(meta);
        console.log(data.products);
        data.products.forEach((product) => {
          if (!this.codeSeen(product.id)) {
            this.codes.unshift(product.id);
          }
        });
      }
    }
    console.log("CONNECTION :: ", this.connection);

    this.connection.onopen = function () {
      this.send(
        // This message will be routed to 'routeA' based on the 'action'
        // property
        JSON.stringify({ action: 'handshake', data: 'hi' })
      );
    };

    this.connection.onmessage = function (e) {
      console.log('Server: ' + e.data);
    };

    window.addEventListener('unload', () => {
      console.log("Websocket closing...")
      this.connection.close();
    });

  },
  components: {
    VideoProductCard,
  },
};
</script>

<style scoped lang="scss">

.shoppable-container {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 350px;
  grid-template-rows: 400px;
  height: 400px;
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
