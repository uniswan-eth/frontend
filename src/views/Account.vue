<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-info">
      <b-row>
        <b-col xl="6" md="6">
          <card header-classes="bg-transparent">
            <b-media no-body class="align-items-center">
              <span class="avatar avatar-lg rounded-circle">
                <img
                  :src="$parent.$parent.makeBlockie($route.params.address)"
                />
              </span>
              <b-media-body class="ml-2 d-none d-lg-block">
                <span class="mb-0 text-lg font-weight-bold">{{
                  $route.params.address.substr(0, 6)
                }}</span>
              </b-media-body>
            </b-media>
          </card>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="NFTs"
            :class="['', !$route.query.tab ? 'tabselected' : 'tabdimmed']"
            :sub-title="nfts.length.toString()"
            type="gradient-red"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <a
                :href="'/#/account/' + this.$route.params.address + ''"
                class="btn btn-sm btn-primary"
                >NFTs</a
              >
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Offers"
            :class="[
              '',
              $route.query.tab === 'offers' ? 'tabselected' : 'tabdimmed',
            ]"
            type="gradient-orange"
            :sub-title="offers.length.toString()"
            icon="ni ni-chart-pie-35"
            class="mb-4"
          >
            <template slot="footer">
              <a
                :href="
                  '/#/account/' + this.$route.params.address + '?tab=offers'
                "
                class="btn btn-sm btn-primary"
                >Offers</a
              >
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Options"
            type="gradient-green"
            :class="[
              '',
              $route.query.tab === 'options' ? 'tabselected' : 'tabdimmed',
            ]"
            :sub-title="swapOptions.length.toString()"
            icon="ni ni-money-coins"
            class="mb-4"
          >
            <template slot="footer">
              <a
                :href="
                  '/#/account/' + this.$route.params.address + '?tab=options'
                "
                class="btn btn-sm btn-primary"
                >Options</a
              >
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="History"
            type="gradient-info"
            :class="[
              '',
              $route.query.tab === 'history' ? 'tabselected' : 'tabdimmed',
            ]"
            :sub-title="$parent.$parent.fillEvents.length.toString()"
            icon="ni ni-chart-bar-32"
            class="mb-4"
          >
            <template slot="footer">
              <a
                :href="
                  '/#/account/' + this.$route.params.address + '?tab=history'
                "
                class="btn btn-sm btn-primary"
                >History</a
              >
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row v-if="!$route.query.tab" class="justify-content-center">
        <b-col lg="12">
          <erc-table
            :nfts="this.$parent.$parent.userERC20s"
            :root="$parent.$parent"
          ></erc-table>
          <b-card-group deck>
            <nft-card2
              minWidth="15rem"
              maxWidth="25rem"
              display="card"
              v-for="(n, idx) in nfts"
              :key="'nft' + idx"
              :nft="n"
              :root="$parent.$parent"
            />
          </b-card-group>
        </b-col>
      </b-row>
      <b-row
        v-if="$route.query.tab === 'offers'"
        class="justify-content-center"
      >
        <b-col lg="12">
          <offers-table :offers="offers" :root="$parent.$parent"></offers-table>
        </b-col>
      </b-row>
      <b-row
        v-if="$route.query.tab === 'options'"
        class="justify-content-center"
      >
        <b-col lg="12">
          <options-table
            display="simple"
            :root="$parent.$parent"
            :options="swapOptions"
          >
            <template v-slot:unsHeader>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">Swap options</h3>
                </b-col>
                <b-col class="text-right"> </b-col>
              </b-row>
            </template>
          </options-table>
        </b-col>
      </b-row>
      <b-row
        v-if="$route.query.tab === 'history'"
        class="justify-content-center"
      >
        <b-col lg="12">
          <history-table
            :events="$parent.$parent.fillEvents"
            :root="$parent.$parent"
          ></history-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BaseHeader from "@/components/BaseHeader";
import NftsTable from "@/views/Dashboard/NftsTable";
import HistoryTable from "./Dashboard/HistoryTable";
import OffersTable from "./Dashboard/OffersTable";
import OptionsTable from "./Dashboard/OptionsTable";
import ErcTable from "./Dashboard/ErcTable";
import NftCard2 from "@/components/UniSwan/NftCard2";

Vue.use(VueClipboard);
export default {
  name: "account",
  components: {
    HistoryTable,
    NftCard2,
    OptionsTable,
    OffersTable,
    BaseHeader,
    NftsTable,
    ErcTable,
  },
  data() {
    return {
      contractAddress: this.$parent.$parent.nonFungibleMaticV2Address,
      nfts: [],
      offers: [],
      swapOptions: [],
      history: [],
    };
  },
  async mounted() {
    document.title = "🦢 Account";

    this.loadPage();
  },
  methods: {
    async loadPage() {
      if (
        this.$route.params.address.toLowerCase() ===
        this.$parent.$parent.signeraddr.toLowerCase()
      ) {
        this.nfts = this.$parent.$parent.usernfts;
        this.offers = this.$parent.$parent.userprefs;
        this.swapOptions = this.$parent.$parent.userSwapOptions;
      } else {
        if (!this.$route.query.tab) {
          this.nfts = await this.$parent.$parent.getUserTokensFromSubGraph(
            this.$route.params.address
          );
          console.log("Acc NFTs", this.nfts);
        } else if (this.$route.query.tab === "offers") {
          this.offers = await this.$parent.$parent.queryOrderBook({
            makerAddress: this.$route.params.address,
          });
          console.log("Acc Offers", this.offers);
        } else if (this.$route.query.tab === "options") {
          this.swapOptions = await this.$parent.$parent.getSwapOptions(
            this.nfts
          );
          console.log("Acc Optiosn", this.swapOptions);
        }
      }
    },
    onCopy() {
      this.$notify({
        type: "info",
        message: "Copied to clipboard",
      });
    },
  },
};
</script>
<style>
.tabselected {
  background: #fff;
}
.tabdimmed {
  background: #ccc;
}
</style>
