<template>
  <div v-if="nft">
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="">
        <b-col lg="6">
          <card header-classes="bg-transparent">
            <b-img :src="nft.metadata.image" alt="" fluid rounded />
          </card>
          <br />
          <card header-classes="bg-transparent">
            <div slot="header" class="mb-0">
              <small class="text-muted text-uppercase">
                <router-link
                  :to="'/explorer/?contract=' + nft.contract_address"
                >
                  {{ nft.contractName }}
                </router-link>
              </small>
              <h1 slot="header" class="mb-0">
                {{ nft.metadata.name }}
              </h1>
            </div>
            <p>
              {{ nft.metadata.description }}
            </p>
            <b-button
              v-if="saved.length === 0"
              @click="$parent.$parent.saveNFT(nft)"
              size="lg"
              variant="success"
            >
              Save nft
            </b-button>
            <b-button
              v-if="saved.length > 0"
              @click="$parent.$parent.removeSavedNFT(nft)"
              size="lg"
              variant="warning"
            >
              Remove saved nft
            </b-button>
            <div v-if="nft.metadata.attributes">
              <hr />
              <div
                v-for="(attr, idx) in nft.metadata.attributes"
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
                  nft.contract_address +
                  '/' +
                  +nft.token_id
                "
              >
                Token ID
                <b>
                  {{ nft.token_id.substr(0, 10) }}
                </b>
                {{
                  nft.token_id.length > 10
                    ? "..." + nft.token_id.substr(nft.token_id.length - 5)
                    : ""
                }}
              </a>
              <a
                class="btn btn-secondary btn-sm"
                rel="noreferrer"
                target="_blank"
                :href="
                  'https://polygonscan.com/address/' + nft.contract_address
                "
              >
                Contract {{ nft.contract_address }}
              </a>
            </div>
            <br />
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
                  $router.push(
                    '/nft/' + nft.contract_address + '/' + nft.token_id
                  )
                "
                :style="{ backgroundImage: 'url(' + nft.metadata.image + ')' }"
                class="imgHolder"
              ></div>
            </div>
            <div class="cb" />
            <b-button
              @click="$parent.$parent.createOrder(nft, ownerAssets)"
              :disabled="
                $parent.$parent.signeraddr.toLowerCase() ===
                nft.owner.toLowerCase()
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
                :title="'Owner: ' + nft.owner"
                class="blockie"
                :src="$parent.$parent.makeBlockie(nft.owner)"
              />
              <account-card :address="nft.owner" :root="$parent.$parent" />
              &nbsp; wish in return for {{ nft.metadata.name }}
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
                  $router.push('/nft/' + nft.contract + '/' + nft.token_id)
                "
                :style="{ backgroundImage: 'url(' + nft.metadata.image + ')' }"
                class="imgHolder"
              ></div>

              <br />
            </div>
            <div class="cb" />
            <br />
            <router-link
              class="btn btn-secondary btn-sm"
              :to="'/account/' + nft.owner + '?tab=offers'"
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
                  <a :href="'/#/account/' + nft.owner + '?tab=nfts'">
                    <img :src="$parent.$parent.makeBlockie(nft.owner)" />
                  </a>
                </span>
                <b-media-body class="ml-2 d-none d-lg-block">
                  <h3>
                    <account-card
                      :address="nft.owner"
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
      saved: [],
      nft: null,
      ownerAssets: null,
      validSwaps: [],
      ownerOrders: [],
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
      this.validSwaps = [];
      this.ownerOrders = [];

      this.nft = await this.$parent.$parent.getTokenExtra(
        this.$route.params.contract,
        this.$route.params.tokenid.toString()
      );

      this.saved = await this.$parent.$parent.checkSaved(this.nft);

      this.$parent.$parent.routeName = this.nft.metadata.name;

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
            y.token_id === this.nft.token_id &&
            y.contract_address === this.nft.contract_address
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
