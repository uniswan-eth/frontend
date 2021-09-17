<template>
  <div>
    <b-card
      no-body
      class="overflow-hidden"
      style="margin-bottom: 20px; zzmax-width: 540px"
    >
      <b-row no-gutters>
        <b-col md="3" style="zzbackground: purple">
          <div
            @click="$router.push('/nft/' + nft.contract + '/' + nft.tokenID)"
            class="bgim"
            :style="{
              cursor: 'pointer',
              backgroundImage: 'url(' + nft.tokenJSON.image + ')',
              width: '100%',
              height: '100%',
              minHeight: '150px',
            }"
            :title="nft.tokenJSON.name"
            alt=""
          />
        </b-col>
        <b-col md="9">
          <b-card-body :title="nft.tokenJSON.name">
            <div class="nftHolder">
              <h6 class="text-muted text-uppercase">Want in exchange</h6>
              <div
                class="bundleHolder"
                v-for="(n, idx) in summary.orders"
                :key="'nftorder' + idx"
              >
                <div
                  @click="
                    $router.push('/nft/' + nft.contract + '/' + nft.tokenID)
                  "
                  class="imgHolder"
                  :style="{
                    backgroundImage: 'url(' + nft.tokenJSON.image + ')',
                  }"
                  v-for="(nft, idx) in n.wishBundle"
                  :key="'wish' + idx"
                ></div>
              </div>
              <div class="cb" />
            </div>
            <div class="nftHolder">
              <h6 class="text-muted text-uppercase">Current options</h6>
              <div
                v-for="(ring, idx) in summary.options"
                class="bundleHolder"
                :key="'swapop' + idx"
              >
                <b-button
                  class="swapBtn"
                  @click="
                    $event.preventDefault();
                    root.viewSwapChain(ring, finalPools[idx]);
                  "
                  v-b-modal.modalSwapChain
                  size="sm"
                  variant="secondary"
                >
                  <i class="ni ni-spaceship"></i>
                </b-button>
                <span
                  v-for="(asset, jdx) in finalPools[idx]"
                  :key="'wish' + jdx"
                >
                  <h1>{{ asset }}</h1>
                  <div
                    v-if="asset.tokenJSON"
                    class="imgHolder"
                    @click="
                      $router.push(
                        '/nft/' + asset.contract + '/' + asset.tokenID
                      )
                    "
                    :style="{
                      backgroundImage: 'url(' + asset.tokenJSON.image + ')',
                    }"
                  />
                  <div v-if="!asset.tokenJSON" class="imgHolder">
                    {{ asset.symbol }}
                  </div>
                </span>
              </div>
              <div class="cb" />
            </div>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import { assetDataUtils } from "@0x/order-utils";

export default {
  name: "nft-summary",
  props: ["summary", "nft", "root"],
  components: {},
  data() {
    return {
      finalPools: [],
    };
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    async loadPage() {
      this.finalPools = [];

      for (let i = 0; i < this.summary.options.length; i++) {
        var ourAssetsEncoded = assetDataUtils.encodeMultiAssetData(
          ...this.$props.root.bundleToData(this.$props.root.usernfts)
        );

        this.summary.options[i].map(
          (order) =>
            (ourAssetsEncoded = this.$props.root.executeOrder(
              ourAssetsEncoded,
              order.signedOrder
            ))
        );

        const bundle = await this.$props.root.dataToBundle(ourAssetsEncoded);
        const remainder = bundle.filter(
          (x) =>
            !this.$props.root.usernfts.some(
              (y) => y.contract === x.contract && y.tokenID === x.tokenID
            )
        );

        // Filter out any assets that the user already owns
        this.finalPools.push(remainder);
      }
    },
  },
};
</script>
<style>
.bundleHolder {
  float: left;
  background: #ccc;
  padding: 5px;
  margin-right: 10px;
  margin-bottom: 5px;
  border-radius: 8px;
}
.imgHolder {
  float: left;
  height: 100px;
  width: 100px;
  border: 3px solid #fff;
  border-radius: 8px;
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Do not repeat the image */
  background-size: cover;
  cursor: pointer;
}
.bundleImage {
  width: 100px;
}
.nftHolder {
  min-height: 100px;
}
</style>
