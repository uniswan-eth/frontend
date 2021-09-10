<template>
  <div class="">
    <h4>{{ asset.symbol }}</h4>
    {{
      Math.round(
        (parseInt(asset.balance) / 10 ** parseInt(asset.decimals)) * 100000
      ) / 100000
    }}
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