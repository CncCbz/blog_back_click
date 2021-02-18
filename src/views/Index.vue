<template>
  <div class="main">
    <layout>
      <left-nav slot="left" ref="leftNav"></left-nav>
      <top-nav slot="header" @changeNav="changeNav"></top-nav>
      <div slot="main">
        <router-view />
      </div>
    </layout>
  </div>
</template>

<script>
  import layout from './nav/layout';
  import leftNav from './nav/left-nav';
  import topNav from './nav/top-nav';
  export default {
    methods: {
      changeNav() {
        this.$refs.leftNav.changeNav();
      }
    },
    components: {
      layout,
      leftNav,
      topNav
    }
  };
</script>

<style scoped></style>
