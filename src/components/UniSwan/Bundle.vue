<template>
  <div style="float: left">
    <div v-for="(n, idx) in bundle" :key="'id' + idx">
      <nft-card
        v-if="n.tokenJSON"
        :idx="idx"
        :display="display"
        :root="root"
        :nft="n"
      >
        <template v-slot:nftHeader>
          <slot name="bundleHeader"></slot>
        </template>
      </nft-card>
      <erc-card v-if="!n.tokenJSON" :asset="n">
        <template v-slot:nftHeader>
          <slot name="bundleHeader"></slot>
        </template>
      </erc-card>
    </div>
    <div class="cb" />
  </div>
</template>
<script>
import NftCard from "@/components/UniSwan/NftCard";
import ErcCard from "@/components/UniSwan/ErcCard.vue";

export default {
  name: "bundle",
  props: ["bundle", "root", "display"],
  components: {
    NftCard,
    ErcCard,
  },
  data() {
    return {};
  },
};
</script>
<style>
</style>
