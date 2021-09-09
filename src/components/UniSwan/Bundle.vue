<template>
  <div style="float:left;">
    <nft-card
      :idx="idx"
      :display="display"
      v-for="(n,idx) in bundle"
      :key="'id'+idx"
      :root="root"
      :nft="n">
      <template v-slot:nftHeader>
        <slot name="bundleHeader"></slot>

        <!-- {{idx}} -->
      </template>
    </nft-card>
    <div class="cb"/>

  </div>
</template>
<script>
  import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'bundle',
    props: ["bundle", "root", "display"],
    components: {
      NftCard
    },
    data() {
      return {

      }
    }
  }
</script>
<style>
</style>
