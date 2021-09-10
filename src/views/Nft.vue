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
            <div
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
          <card header-classes="bg-transparent">
            <div slot="header">
              <h6
                slot="header"
                class="navbar-heading text-muted text-uppercase"
              >
                Chain Info
              </h6>
              <h2 class="mb-0">
                <router-link
                  :to="'/explorer/?contract=' + asset.asset_contract.address"
                >
                  {{ contract.name }}
                </router-link>
              </h2>
            </div>
            <!-- <pre>{{contract}}</pre> -->
            <div>
              Address:
              <!-- target="_blank" -->
              <a
                rel="noreferrer"
                :href="
                  'https://polygonscan.com/address/' +
                  asset.asset_contract.address
                  /* '/#/explorer?contract=' + asset.asset_contract.address */
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
          <options-table
            display="simple"
            :root="$parent.$parent"
            :options="validSwaps"
          >
            <template v-slot:unsHeader>
              <b-row align-v="center">
                <b-col>
                  <!-- <h3 class="mb-0"> -->
                  <h6
                    slot="header"
                    class="navbar-heading text-muted text-uppercase"
                  >
                    This NFT can be swapped for
                  </h6>
                </b-col>
                <b-col class="text-right">
                  <b-button
                    :disabled="
                      $parent.$parent.signeraddr.toLowerCase() ===
                      asset.owner.address.toLowerCase()
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
            <h6 slot="header" class="navbar-heading text-muted text-uppercase">
              What
              <!-- <img :src="$parent.$parent.makeBlockie(asset.owner.address)"/> -->
              &nbsp;
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
              class=""
            >
              <bundle
                display="medium"
                :bundle="order.wishBundle"
                :root="$parent.$parent"
              >
                <template v-slot:bundleHeader>
                  <b-button
                    @click="
                      $event.preventDefault();
                      $parent.$parent.viewOrder(order);
                    "
                    v-b-modal.modalOffer
                    size="sm"
                    variant="secondary"
                  >
                    <span>
                      {{
                        order.wishBundle[0].owner.toLowerCase() ===
                        $parent.$parent.signeraddr.toLowerCase()
                          ? "Execute"
                          : "View"
                      }}
                      <!-- Order -->
                    </span>
                  </b-button>
                </template>
              </bundle>
              <br />
            </div>
          </card>
          <br />
          <br />
          <card header-classes="bg-transparent">
            <div slot="header">
              <h6 class="navbar-heading text-muted text-uppercase">
                NFTs held by the same owner
              </h6>
              <b-media no-body class="align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                  <a :href="'/#/account/' + asset.owner.address">
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
                v-for="(n, idx) in ownerAssets.nfts"
                :key="'ownernft' + idx"
                :nft="n"
                :root="$parent.$parent"
              />
            </b-card-group>
          </card>
          <!-- <nfts-table :nfts="ownerAssets" :root="$parent.$parent">
            <template v-slot:unsHeader>
              <h5>Owner</h5>
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
                      <h3>
                        <account-card
                          :address="asset.owner.address"
                          :root="$parent.$parent"
                        />
                      </h3>
                    </b-media-body>
                  </b-media>
                </b-col>
                <b-col class="text-right">
                  <a
                    :href="'/#/account/' + asset.owner.address"
                    class="btn btn-sm btn-secondary"
                    >See account</a
                  >
                </b-col>
              </b-row>
            </template>
          </nfts-table> -->
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
import NftCard2 from "@/components/UniSwan/NftCard2";

Vue.use(VueClipboard);
export default {
  name: "nft",
  components: {
    NftCard2,
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
      contract: null,
      asset: null,
      ownerAssets: null,
      validSwaps: [],
      ownerOrders: [],
      signerApproved: false,
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

      this.contract = await this.$parent.$parent.getContract(
        this.$route.params.contract
      );

      this.signerApproved = await this.$parent.$parent.signerIsApproved(
        this.$route.params.contract
      );

      var nft = await this.$parent.$parent.getTokenFromSubgraph(
        this.$route.params.contract,
        this.$route.params.tokenid.toString()
      );

      // Use same format as OpenSea API
      console.log(
        nft,
        this.$route.params.contract,
        this.$route.params.tokenid.toString()
      );
      this.asset = this.$parent.$parent.formatAsset(nft);
      // this.asset = this.$parent.$parent.formatAsset2(nft);

      // Swap Options
      this.validSwaps = await this.$parent.$parent.getSwapOptions([nft]);

      // Owners Assets
      // FIXME: this will fail on Mainnet
      // this.ownerAssets = await this.$parent.$parent.getUserTokensFromSubGraph(
      this.ownerAssets = await this.$parent.$parent.getUserTokensFromSubGraph2(
        nft.owner
      );
      // this.ownerAssets = res.nfts
      // this.ownerInfo = res.raw

      var orders = await this.$parent.$parent.queryOrderBook({
        makerAddress: nft.owner,
      });
      orders.map((x) => {
        x.exchangeBundle.map((y) => {
          if (y.tokenID === nft.tokenID && y.contract === nft.contract)
            this.ownerOrders.push(x);
        });
      });
      console.log(
        "ddd orders",
        this.ownerOrders,
        nft.owner,
        this.$parent.$parent.signeraddr
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
