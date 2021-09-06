<template>
  <div v-if="asset">
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="6" md="6"> </b-col>
        <b-col xl="6" md="6"> </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="">
        <b-col lg="6">
          <card header-classes="bg-transparent">
            <b-img :src="asset.image_url" alt="" fluid rounded />
          </card>
          <br />
          <card header-classes="bg-transparent">
            <h1 slot="header" class="mb-0">
              {{ asset.name }}
            </h1>
            <p>
              {{ asset.description }}
            </p>
            <br />
            <b-button
              v-if="
                $parent.$parent.signeraddr === asset.owner.address &&
                !asset.signerApprovedForCollection
              "
              @click="
                $parent.$parent.approveTransfers(asset.asset_contract.address)
              "
              size="lg"
              variant="success"
            >
              Approve transfers
            </b-button>
            <b-button
              v-if="
                $parent.$parent.signeraddr === asset.owner.address &&
                asset.signerApprovedForCollection
              "
              @click="
                $parent.$parent.unApproveTransfers(asset.asset_contract.address)
              "
              size="sm"
              variant="secondary"
            >
              Remove approval
            </b-button>
          </card>
          <br />
          <card header-classes="bg-transparent">
            <h2 slot="header" class="mb-0">Chain Info</h2>
            <div>
              Address:
              <a
                target="_blank"
                rel="noreferrer"
                :href="
                  'https://etherscan.io/address/' + asset.asset_contract.address
                "
              >
                {{ asset.asset_contract.address }}
              </a>
            </div>
            <div :title="asset.token_id">
              TokenID: {{ asset.token_id.substr(0, 10)
              }}{{
                asset.token_id.length > 10
                  ? "..." + asset.token_id.substr(asset.token_id.length - 5)
                  : ""
              }}
            </div>
            <div>Type: {{ asset.asset_contract.schema_name }}</div>
          </card>
        </b-col>
        <b-col lg="6">
          <options-table :root="$parent.$parent" :options="validSwaps">
            <template v-slot:unsHeader>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">Offers</h3>
                </b-col>
                <b-col class="text-right">
                  <b-button
                    :disabled="
                      $parent.$parent.signeraddr === asset.owner.address
                    "
                    @click="$parent.$parent.createOrder(asset, ownerAssets)"
                    v-b-modal.modalCreateOffer
                    size="lg"
                    variant="success"
                  >
                    Make offer
                  </b-button>
                </b-col>
              </b-row>
            </template>
          </options-table>
          <br />
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Get it now!</h3>
          </card>
          <br />
          <nfts-table :nfts="ownerAssets" :root="$parent.$parent">
            <template v-slot:unsHeader>
              <h3>Owner</h3>
              <br />
              <b-row align-v="center">
                <b-col>
                  <b-media no-body class="align-items-center">
                    <span class="avatar avatar-sm rounded-circle">
                      <a :href="'/#/account/' + asset.owner.address">
                        <img
                          :src="
                            $parent.$parent.makeBlockie(asset.owner.address)
                          "
                        />
                      </a>
                    </span>
                    <b-media-body class="ml-2 d-none d-lg-block">
                      <span class="mb-0 text-sm font-weight-bold">
                        <account-card
                          :address="asset.owner.address"
                          :root="$parent.$parent"
                        />
                      </span>
                    </b-media-body>
                  </b-media>
                </b-col>
                <b-col class="text-right">
                  <a
                    :href="'/#/account/' + asset.owner.address"
                    class="btn btn-sm btn-secondary"
                    >See all owners NFTs</a
                  >
                </b-col>
              </b-row>
            </template>
          </nfts-table>
        </b-col>
      </b-row>
      <br />
      <b-row class="justify-content-center" v-if="asset.collection">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Collection</h3>
            <collection :collection="asset.collection" />
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
import NftCard from "@/components/UniSwan/NftCard";
import Bundle from "@/components/UniSwan/Bundle";
import AccountCard from "@/components/UniSwan/AccountCard";

Vue.use(VueClipboard);
export default {
  name: "nft",
  components: {
    AccountCard,
    OptionsTable,
    Bundle,
    NftCard,
    NftsTable,
    Collection,
    BaseHeader,
  },
  data() {
    return {
      asset: null,
      ownerAssets: [],
      validSwaps: [],
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
      var nft = await this.$parent.$parent.getTokenFromSubgraph(
        this.$route.params.contract,
        this.$route.params.tokenid.toString()
      );

      // Use same format as OpenSea API
      this.asset = this.$parent.$parent.formatAsset(nft);

      // Swap Options
      this.validSwaps = await this.$parent.$parent.getSwapOptions([nft]);

      // Owners Assets
      // FIXME: this will fail on Mainnet
      this.ownerAssets = await this.$parent.$parent.getUserTokensFromSubGraph(
        nft.owner
      );
    },
    onCopy() {
      this.$notify({
        type: "info",
        message: "Copied to clipboard",
      });
    },
  },
  watch: {
    $route: function () {
      this.loadPage();
    },
  },
};
</script>
<style></style>
