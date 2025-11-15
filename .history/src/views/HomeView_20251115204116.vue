<template>
  <div>
    <HeaderComponent />
    <HeroBanner image="/img/articles/hero-sample.jpg" />
    <ProductGrid :products="products" />
    <FeatureSection />
    <Newsletter />
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from '../components/HeaderComponent.vue';
import FooterComponent from '../components/FooterComponent.vue';
import HeroBanner from '../components/HeroBanner.vue';
import ProductGrid from '../components/ProductGrid.vue';
import FeatureSection from '../components/FeatureSection.vue';
import Newsletter from '../components/Newsletter.vue';

import products from '../data/sample-products.json';

export default {
  components: { HeaderComponent, FooterComponent, HeroBanner, ProductGrid, FeatureSection, Newsletter },
  data(){
    return { products }
  }
};
</script>
