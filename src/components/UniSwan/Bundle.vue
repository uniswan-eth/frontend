<template>
  <div style="float: left">
    <div v-for="(n, idx) in bundle" :key="'id' + idx">
      <nft-card
        v-if="n.metadata"
        :idx="idx"
        :display="display"
        :root="root"
        :nft="n"
      >
        <template v-slot:nftHeader>
          <slot name="bundleHeader"></slot>
        </template>
      </nft-card>
      <erc-card v-if="!n.metadata" :asset="n">
        <template v-slot:nftHeader>
          <slot name="bundleHeader"></slot>
        </template>
      </erc-card>
      <div class="cb" />
    </div>
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
