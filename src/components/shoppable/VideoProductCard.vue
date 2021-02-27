<template>
  <transition name="fade" appear>
    <div v-if="product" class="product-card">
      <div class="product-img">
        <img :src="product.images[3].url" />
      </div>
      <div class="product-details">
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
  },

  setup(props) {
    console.log("Item Selector PROPS :: ", props);

    const product = ref(null);

    fetch(`mocks/product/${props.code}.json`)
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        console.log(myJson);
        product.value = myJson;
      });

    return {
      product,
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
  width: 350px;
  display: grid;
  grid-gap: 5px;
  grid-template-columns: 100px 1fr;
  .product-details {
    font-family: "Helvetica-Now-Text-Regular";
    font-size: 13px;
    font-weight: 400;
    text-align: left;
    line-height: 16px;
  }
  .product-img {
    // z-index: 100;
    margin: auto;
    img {
      max-width: 100px;
      max-height: 100px;
      object-fit: contain;
      // z-index: 0;
      // overflow: hidden;
    }
  }
}
</style>