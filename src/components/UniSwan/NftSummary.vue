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
                    root.viewSwapChain(ring);
                  "
                  v-b-modal.modalSwapChain
                  size="sm"
                  variant="secondary"
                >
                  <i class="ni ni-spaceship"></i>
                </b-button>
                <div
                  @click="
                    $router.push('/nft/' + nft.contract + '/' + nft.tokenID)
                  "
                  v-for="(nft, jdx) in finalPools[idx]"
                  :key="'wish' + jdx"
                  :style="{
                    backgroundImage: 'url(' + nft.tokenJSON.image + ')',
                  }"
                  class="imgHolder"
                />
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
import { BigNumber } from "@0x/utils";

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
    encodeAssets(bundle) {
      let amounts = [];
      let assetDatas = [];
      for (let i = 0; i < bundle.length; i++) {
        let assetData;
        if (bundle[i].tokenJSON) {
          assetData = assetDataUtils.encodeERC721AssetData(
            bundle[i].contract,
            new BigNumber(bundle[i].tokenID)
          );
          amounts.push(new BigNumber(1));
        } else {
          assetData = assetDataUtils.encodeERC20AssetData(bundle[i].address);
          amounts.push(new BigNumber(bundle[i].balance));
        }
        assetDatas.push(assetData);
      }
      return [amounts, assetDatas];
    },
    async loadPage() {
      this.finalPools = [];

      for (let i = 0; i < this.summary.options.length; i++) {
        var ourAssetsEncoded = assetDataUtils.encodeMultiAssetData(
          ...this.encodeAssets(this.$props.root.usernfts)
        );

        this.summary.options[i].map(
          (order) =>
            (ourAssetsEncoded = this.executeOrder(
              ourAssetsEncoded,
              order.signedOrder
            ))
        );

        const bundle = await this.dataToBundle(ourAssetsEncoded);

        // Filter out any assets that the user already owns
        this.finalPools.push(
          bundle.filter(
            (x) =>
              !this.$props.root.usernfts.some(
                (y) => y.contract === x.contract && y.tokenID === x.tokenID
              )
          )
        );
      }
    },
    async dataToBundle(assetData) {
      var inter = assetDataUtils.decodeMultiAssetDataRecursively(assetData);
      const bundle = [];

      for (let i = 0; i < inter.nestedAssetData.length; i++) {
        if (inter.amounts[i] > 0) {
          if (inter.nestedAssetData[i].assetProxyId === "0xf47261b0") {
            var collection = new ethers.Contract(
              "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
              ERC20ABI,
              this.signer
            );
            bundle.push({
              address: inter.nestedAssetData[i].tokenAddress,
              name: await collection.name(),
              symbol: await collection.symbol(),
              decimals: await collection.decimals(),
              balance: inter.amounts[i],
            });
          } else if (inter.nestedAssetData[i].assetProxyId === "0x02571792") {
            var result = await this.$props.root.getTokenFromSubgraph(
              inter.nestedAssetData[i].tokenAddress,
              inter.nestedAssetData[i].tokenId.toNumber().toString()
            );
            bundle.push(result.nft);
          }
        }
      }

      return bundle;
    },
    executeOrder(ourAssetsEncoded, order) {
      const takerAssets = assetDataUtils.decodeAssetDataOrThrow(
        order.takerAssetData
      );

      const ourAssets = assetDataUtils.decodeAssetDataOrThrow(ourAssetsEncoded);

      for (let i = 0; i < takerAssets.nestedAssetData.length; i++) {
        const index = ourAssets.nestedAssetData.indexOf(
          takerAssets.nestedAssetData[i]
        );
        if (index > -1) {
          ourAssets.amounts[index] = ourAssets.amounts[index].minus(
            takerAssets.amounts[i]
          );
          if (ourAssets.amounts[index].toNumber() < 0) return null;
        } else return null;
      }

      const makerAssets = assetDataUtils.decodeAssetDataOrThrow(
        order.makerAssetData
      );

      for (let i = 0; i < makerAssets.nestedAssetData.length; i++) {
        var index = ourAssets.nestedAssetData.indexOf(
          makerAssets.nestedAssetData[i]
        );
        if (index === -1) {
          index = ourAssets.nestedAssetData.length;
          ourAssets.nestedAssetData.push(makerAssets.nestedAssetData[i]);
          ourAssets.amounts.push(new BigNumber(0));
        }
        ourAssets.amounts[index] = ourAssets.amounts[index].plus(
          makerAssets.amounts[i]
        );
      }

      const newOurAssetsEncoded = assetDataUtils.encodeMultiAssetData(
        ourAssets.amounts,
        ourAssets.nestedAssetData
      );

      return newOurAssetsEncoded;
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
