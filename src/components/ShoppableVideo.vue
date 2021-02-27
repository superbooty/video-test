<template>
  <div class="shoppable-container">
    <div class="video-container aspect-169 pos-relative">
      <video class="video-el br-all pos-absolute"
        :poster="videoPoster"
        controls autoplay>
        <source :src="videoSrc" />
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
        <video-product-card v-for="code in codes"
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

    const videoSrc = ref(
      "https://assets.contentstack.io/v3/assets/bltab687eb09ed92451/blt0516a2ddf86d32f7/60256c5f5f9b2812764c3de9/levisSeasonalSample.mp4"
    );
    const metaFileSrc = ref("/video-meta/meta.vtt");
    const videoPoster = ref("https://images.contentstack.io/v3/assets/blt2d702d64bab5cd4d/blt04212de7f2aedc90/5e3030fbe147ae4537d92d1f/sh_50193_chino.jpg?width=1030&format=pjpg&quality=90");

    // methods
    const codeSeen = (code) => {
      return codes.length > 0 ? codes.includes(code) : false;
    }

    return {
      videoSrc,
      metaFileSrc,
      videoPoster,
      codes,
      codeSeen
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
    };
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
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 400px;
  height: 400px;
  .video-container {
    width: 500px;
    video {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  }
  .shoppable-products {
    height: 100%;
    scroll-behavior: smooth;
    overflow-y: auto;
    list-style-type: none;
    height: 100%;
  }
}

.video-el {
  width: 400px;
}
</style>
