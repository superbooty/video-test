<template>
  <transition name="fade">
    <div :id="code" v-if="product" class="product-card" :class="{'high-light': highlight}"
      @click="atcProduct(code)">
      <div class="product-img">
        <img :src="product.images[3].url" />
      </div>
      <div class="product-details" :class="{'separator': separator}">
        <div class="product-name">{{ product.name }}</div>
        <div class="color">Color: {{ product.colorName }}</div>
        <div>{{ product.price.formattedValue }}</div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from "vue";

export default {
  props: {
    code: String,
    highlight: {
        type: Boolean,
        default: false,
    },
    separator: {
      type: Boolean,
      default: false,
    }
  },

  setup(props, {emit}) {
    console.log("Item Selector PROPS :: ", props);

    const product = ref(null);

    fetch(`mocks/product/${props.code}.json`)
      .then((response) => {
        const jsonObj = response.json();
        console.log(jsonObj);
        return jsonObj;
      })
      .then((myJson) => {
        console.log(myJson);
        product.value = myJson;
      });

      // methods
      const atcProduct = (code) => {
         emit("open-modal", code);
      }

    return {
      product,
      atcProduct
    };
  },
};
</script>

<style scoped lang="scss">

.fade-enter-active,
.fade-leave-active {
  z-index: 1000;
  background: white;
  transition: all 1.2s ease-in-out;
  transform-origin: left top;
  position: relative;
  transform: scale(1);
  max-height: 110px;
}

.fade-enter-from,
.fade-leave-to {
  transform: scale(0);
  max-height: 20px;
  background: white;
}


.product-card {
  width: 100%;
  display: grid;
  grid-gap: 5px;
  background: white;
  grid-template-columns: 90px 1fr;
  grid-template-rows: 90px;
  .product-details {
    &.separator {
      border-top: 2px solid #d6d6d6;
    }
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-family: "Helvetica-Now-Text-Regular";
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    line-height: 16px;
  }
  .product-img {
    // z-index: 100;
    margin: auto;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      &:hover {
        transform: scaleX(-1);
      }
      // z-index: 0;
      // overflow: hidden;
    }
  }
}
</style>