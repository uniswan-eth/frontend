<template>
  <div v-if="asset">
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="">
        <b-col lg="6">
          <card header-classes="bg-transparent">
            <b-img :src="asset.image_url" alt="" fluid rounded />
          </card>
          <br />
          <card header-classes="bg-transparent">
            <div slot="header" class="mb-0">
              <small class="text-muted text-uppercase">
                <router-link
                  :to="'/explorer/?contract=' + asset.asset_contract.address"
                >
                  {{ nft.contractName }}
                </router-link>
              </small>
              <h1 slot="header" class="mb-0">
                {{ asset.name }}
              </h1>
            </div>
            <p>
              {{ asset.description }}
            </p>
            <b-button
              v-if="!saved.length || saved.length === 0"
              @click="$parent.$parent.saveNFT(nft)"
              size="lg"
              variant="success"
            >
              Save
            </b-button>
            <b-button
              v-if="saved.length > 0"
              @click="$parent.$parent.removeSavedNFT(nft)"
              size="lg"
              variant="warning"
            >
              Remove
            </b-button>
            <div v-if="nft.tokenJSON.attributes">
              <hr />
              <div
                v-for="(attr, idx) in nft.tokenJSON.attributes"
                :key="'trait' + idx"
              >
                <div class="attr">
                  <div class="type">
                    {{ attr.trait_type }}
                  </div>
                  <div class="value">
                    {{ attr.value }}
                  </div>
                </div>
              </div>
              <div class="cb" />
            </div>
            <hr />
            <div>
              <a
                class="btn btn-secondary btn-sm"
                rel="noreferrer"
                target="_blank"
                :href="
                  'https://opensea.io/assets/matic/' +
                  asset.asset_contract.address +
                  '/' +
                  +asset.token_id
                "
              >
                Token ID
                <b>
                  {{ asset.token_id.substr(0, 10) }}
                </b>
                {{
                  asset.token_id.length > 10
                    ? "..." + asset.token_id.substr(asset.token_id.length - 5)
                    : ""
                }}
              </a>
              <a
                class="btn btn-secondary btn-sm"
                rel="noreferrer"
                target="_blank"
                :href="
                  'https://polygonscan.com/address/' +
                  asset.asset_contract.address
                "
              >
                Contract {{ asset.asset_contract.address }}
              </a>
            </div>
            <br />
            <div
              class="slide"
              v-if="
                asset.owner.address.toLowerCase() ===
                $parent.$parent.signeraddr.toLowerCase()
              "
            >
              <b-button
                v-if="!signerApproved"
                @click="
                  $parent.$parent.approveTransfers(asset.asset_contract.address)
                "
                size="lg"
                variant="success"
              >
                Approve transfers
              </b-button>
              <b-button
                v-if="signerApproved"
                @click="
                  $parent.$parent.unApproveTransfers(
                    asset.asset_contract.address
                  )
                "
                size="sm"
                variant="secondary"
              >
                Remove approval
              </b-button>
            </div>
          </card>
          <br />
        </b-col>
        <b-col lg="6">
          <card header-classes="bg-transparent">
            <h6 slot="header" class="navbar-heading text-muted text-uppercase">
              This NFT can be swapped for
            </h6>
            <div
              v-for="(ring, idx) in validSwaps"
              class="bundleHolder"
              :key="'ring' + idx"
            >
              <b-button
                class="swapBtn"
                @click="
                  $event.preventDefault();
                  $parent.$parent.viewSwapChain(ring, finalPools[idx]);
                "
                v-b-modal.modalSwapChain
                size="sm"
                variant="secondary"
              >
                <i class="ni ni-spaceship"></i>
              </b-button>
              <div
                v-for="(nft, idx) in ring[ring.length - 1].exchangeBundle"
                :key="'wish' + idx"
                @click="
                  $router.push('/nft/' + nft.contract + '/' + nft.tokenID)
                "
                :style="{ backgroundImage: 'url(' + nft.tokenJSON.image + ')' }"
                class="imgHolder"
              ></div>
            </div>
            <div class="cb" />
            <b-button
              @click="$parent.$parent.createOrder(asset, ownerAssets)"
              :disabled="
                $parent.$parent.signeraddr.toLowerCase() ===
                asset.owner.address.toLowerCase()
              "
              v-b-modal.modalCreateOffer
              size="lg"
              variant="success"
            >
              Make offer
            </b-button>
          </card>
          <br />
          <card header-classes="bg-transparent">
            <h6 slot="header" class="navbar-heading text-muted text-uppercase">
              What &nbsp;
              <img
                :title="'Owner: ' + asset.owner.address"
                class="blockie"
                :src="$parent.$parent.makeBlockie(asset.owner.address)"
              />
              <account-card
                :address="asset.owner.address"
                :root="$parent.$parent"
              />
              &nbsp; wish in return for {{ asset.name }}
            </h6>
            <div
              v-for="(order, idx) in ownerOrders"
              :key="'order' + idx"
              class="bundleHolder"
            >
              <div
                v-for="(nft, idx) in order.wishBundle"
                :key="'wish' + idx"
                @click="
                  $router.push('/nft/' + nft.contract + '/' + nft.tokenID)
                "
                :style="{ backgroundImage: 'url(' + nft.tokenJSON.image + ')' }"
                class="imgHolder"
              ></div>

              <br />
            </div>
            <div class="cb" />
            <br />
            <router-link
              class="btn btn-secondary btn-sm"
              :to="'/account/' + asset.owner.address + '?tab=offers'"
            >
              See all
            </router-link>
          </card>
          <br />
        </b-col>
      </b-row>
      <br />
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <div slot="header">
              <h6 class="navbar-heading text-muted text-uppercase">
                NFTs held by the same owner
              </h6>
              <b-media no-body class="align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                  <a :href="'/#/account/' + asset.owner.address + '?tab=nfts'">
                    <img
                      :src="$parent.$parent.makeBlockie(asset.owner.address)"
                    />
                  </a>
                </span>
                <b-media-body class="ml-2 d-none d-lg-block">
                  <h3>
                    <account-card
                      :address="asset.owner.address"
                      :root="$parent.$parent"
                    />
                  </h3>
                </b-media-body>
              </b-media>
            </div>
            <b-card-group deck v-if="ownerAssets">
              <nft-card2
                minWidth="8rem"
                maxWidth="12rem"
                display="card"
                v-for="(n, idx) in ownerAssets"
                :key="'ownernft' + idx"
                :nft="n"
                :root="$parent.$parent"
              />
            </b-card-group>
          </card>
        </b-col>
      </b-row>
      <br />
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BaseHeader from "@/components/BaseHeader";
import Collection from "@/components/UniSwan/Collection";
import NftsTable from "./Dashboard/NftsTable";
import OptionsTable from "./Dashboard/OptionsTable";
import Bundle from "@/components/UniSwan/Bundle";
import AccountCard from "@/components/UniSwan/AccountCard";
import NftCard2 from "@/components/UniSwan/NftCard2";
import { assetDataUtils } from "@0x/order-utils";

Vue.use(VueClipboard);
export default {
  name: "nft",
  components: {
    NftCard2,
    AccountCard,
    OptionsTable,
    Bundle,
    NftsTable,
    Collection,
    BaseHeader,
  },
  data() {
    return {
      saved: null,
      contract: null,
      asset: null,
      nft: null, // our format
      assetSubGraph: null,
      ownerAssets: null,
      validSwaps: [],
      ownerOrders: [],
      signerApproved: false,
      finalPools: [],
    };
  },
  async mounted() {
    document.title = "🦢 NFT";
    this.loadPage();
  },
  methods: {
    async loadPage() {
      this.ownerAssets = [];
      this.asset = null;
      this.validSwaps = [];
      this.ownerOrders = [];

      this.signerApproved = await this.$parent.$parent.signerIsApproved(
        this.$route.params.contract
      );

      var dataAPI = await this.$parent.$parent.getNFTsFromAPI(
        "nfts/" +
          this.$route.params.contract +
          "/" +
          this.$route.params.tokenid.toString()
      );

      this.nft = this.$parent.$parent.normalizeNFTs(dataAPI)[0];

      this.nft.contractName = (
        await this.$parent.$parent.getContractFromSubGraph(
          this.$route.params.contract
        )
      ).name;

      this.nft.owner = await this.$parent.$parent.getOwnerFromSubgraph(
        this.$route.params.contract,
        this.$route.params.tokenid.toString()
      );

      this.saved = await this.$parent.$parent.checkSaved(this.nft);

      this.$parent.$parent.routeName = this.nft.tokenJSON.name;

      // Use same format as OpenSea API
      this.asset = this.$parent.$parent.formatAsset(this.nft);

      // Swap Options
      this.validSwaps = await this.$parent.$parent.getSwapOptions([this.nft]);
      this.finalPools = await this.buildFinalPools([this.nft]);

      // Owners Assets
      this.ownerAssets = await this.$parent.$parent.getUserTokens(
        this.nft.owner
      );

      var orders = await this.$parent.$parent.getOrdersFromDB({
        makerAddress: this.nft.owner.toLowerCase(),
      });
      orders.map((x) => {
        x.exchangeBundle.map((y) => {
          if (
            y.tokenID === this.nft.tokenID &&
            y.contract === this.nft.contract
          )
            this.ownerOrders.push(x);
        });
      });
    },
    async buildFinalPools(nfts) {
      var finalPools = [];

      for (let i = 0; i < this.validSwaps.length; i++) {
        var ourAssetsEncoded = assetDataUtils.encodeMultiAssetData(
          ...this.$parent.$parent.bundleToData(nfts)
        );

        this.validSwaps[i].map(
          (order) =>
            (ourAssetsEncoded = this.$parent.$parent.executeOrder(
              ourAssetsEncoded,
              order.signedOrder
            ))
        );

        const bundle = await this.$parent.$parent.dataToBundle(
          ourAssetsEncoded
        );

        // Filter out any assets that the user already owns
        finalPools.push(bundle);
      }
      return finalPools;
    },
  },
  watch: {
    $route: function () {
      this.loadPage();
    },
  },
};
</script>
<style>
.attr {
  float: left;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px 20px;
  background: #eee;
  text-align: center;
  margin-right: 10px;
  margin-bottom: 10px;
}
.type {
  color: grey;
}
.value {
  font-weight: bold;
}
.rarity {
  font-size: 12px;
}
</style>
