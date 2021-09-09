<template>
  <div class="">
    <h4>{{ asset.name }}</h4>
    {{ parseInt(asset.balance) / 10 ** parseInt(asset.decimals) }}
  </div>
</template>
<script>
export default {
  name: "erc-card",
  props: ["asset"],
  components: {},
  data() {
    return {};
  },
};
</script>