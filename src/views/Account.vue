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
            <div class="text-right">
              <a
                :href="'/#/account/' + this.$route.params.address + ''"
                class="btn btn-sm btn-primary"
              >
                Dashboard</a
              >
            </div>
          </card>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="NFTs"
            :class="[
              '',
              $route.query.tab === 'nfts' ? 'tabselected' : 'tabdimmed',
            ]"
            :sub-title="nfts.length.toString()"
            type="gradient-red"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer">
              <a
                :href="'/#/account/' + this.$route.params.address + '?tab=nfts'"
                class="btn btn-sm btn-primary"
                >NFTs</a
              >
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Orders"
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
        <b-col xl="12" class="mb-5 mb-xl-0">
          <nft-summary
            display="card"
            v-for="(n, idx) in summary"
            :key="'nft' + idx"
            :nft="n.nft"
            :summary="n"
            :root="$parent.$parent"
          />
        </b-col>
      </b-row>
      <b-row v-if="$route.query.tab === 'nfts'" class="justify-content-center">
        <b-col lg="12">
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
          <b-card-group deck>
            <erc-card
              v-for="(n, idx) in $parent.$parent.userERC20s"
              :key="'asset' + idx"
              :asset="n"
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
            zzdisplay="simple"
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
import ErcCard from "@/components/UniSwan/ErcCard";
import NftCard2 from "@/components/UniSwan/NftCard2";
import NftSummary from "@/components/UniSwan/NftSummary";

Vue.use(VueClipboard);
export default {
  name: "account",
  components: {
    NftSummary,
    HistoryTable,
    NftCard2,
    OptionsTable,
    OffersTable,
    BaseHeader,
    NftsTable,
    ErcCard,
  },
  data() {
    return {
      summary: [],
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
      this.$parent.$parent.routeName = this.$route.params.address.substr(0, 6);

      if (
        this.$route.params.address.toLowerCase() ===
        this.$parent.$parent.signeraddr.toLowerCase()
      ) {
        this.nfts = this.$parent.$parent.usernfts;
        this.offers = this.$parent.$parent.userprefs;
        this.swapOptions = this.$parent.$parent.userSwapOptions;
      } else {
        this.nfts = await this.$parent.$parent.getUserTokens(
          this.$route.params.address
        );
        this.offers = await this.$parent.$parent.getOrdersFromDB({
          makerAddress: this.$route.params.address,
        });
        this.swapOptions = await this.$parent.$parent.getSwapOptions(this.nfts);
      }
      this.nfts.map((nft) => {
        var nftSummary = {
          nft: nft,
          orders: [],
          options: [],
        };
        this.offers.map((order) => {
          order.exchangeBundle.map((exch) => {
            if (
              exch.contract === nft.contract &&
              exch.tokenID === nft.tokenID
            ) {
              nftSummary.orders.push(order);
            }
          });
        });
        this.swapOptions.map((ring) => {
          ring[ring.length - 1].wishBundle.map((exch) => {
            if (
              exch.contract === nft.contract &&
              exch.tokenID === nft.tokenID
            ) {
              nftSummary.options.push(ring);
            }
          });
        });
        this.summary.push(nftSummary);
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
