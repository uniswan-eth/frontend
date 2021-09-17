<template>
  <div class="erc20card">
    <h4>{{ asset.symbol }}</h4>
    {{ parseInt(asset.amount) / 10 ** parseInt(asset.decimals) }}
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
<style>
.erc20card {
  background: #eee;
  border-style: dashed;
  padding: 10px;
}
</style>
