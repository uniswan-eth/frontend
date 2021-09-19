<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-primary">
      <b-row>
        <b-col xl="3" md="6">
          <stats-card
            title="NFTs"
            type="gradient-red"
            :sub-title="$parent.$parent.usernfts.length.toString()"
            icon="ni ni-active-40"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Orders"
            type="gradient-orange"
            :sub-title="$parent.$parent.userOrders.length.toString()"
            icon="ni ni-chart-pie-35"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="Options"
            type="gradient-green"
            :sub-title="$parent.$parent.userSwapOptions.length.toString()"
            icon="ni ni-money-coins"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card
            title="History"
            type="gradient-info"
            :sub-title="$parent.$parent.fillEvents.length.toString()"
            icon="ni ni-chart-bar-32"
            class="mb-4"
          >
            <template slot="footer"> </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
          <nft-summary
            display="card"
            v-for="(summary, idx) in summarys"
            :key="'nft' + idx"
            :nft="summary.nft"
            :summary="summary"
            :root="$parent.$parent"
          />
        </b-col>
      </b-row>
      <b-row class="mt-5">
        <b-col xl="12" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <h2 slot="header" class="mb-0">Saved</h2>
            <b-card-group deck>
              <nft-card2
                display="card"
                v-for="(n, idx) in $parent.$parent.savedNFTs"
                :key="'savednft' + idx"
                :nft="n"
                :root="$parent.$parent"
              />
            </b-card-group>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import NftsTable from "./Dashboard/NftsTable";
import OffersTable from "./Dashboard/OffersTable";
import OptionsTable from "./Dashboard/OptionsTable";
import NftSummary from "@/components/UniSwan/NftSummary";
import NftCard2 from "@/components/UniSwan/NftCard2";

export default {
  components: {
    NftSummary,
    NftCard2,
    OptionsTable,
    NftsTable,
    OffersTable,
  },
  data() {
    return {
      summarys: [],
    };
  },
  mounted() {
    document.title = "🦢 UniSwan";
    this.$parent.$parent.routeName = "Dashboard";

    // Build summarys
    this.$parent.$parent.usernfts.map((nft) => {
      var nftSummary = {
        nft: nft,
        orders: [],
        options: [],
      };

      // Find all of the orders where the user is offering this NFT in the exchange bundle
      this.$parent.$parent.userOrders.map((order) => {
        order.exchangeBundle.map((exch) => {
          if (exch.contract === nft.contract && exch.tokenID === nft.tokenID)
            nftSummary.orders.push(order);
        });
      });

      // Find all of the orders which includes this NFT in the wish bundle
      this.$parent.$parent.userSwapOptions.map((chain) => {
        const found = chain[0].wishBundle.find(
          (exch) =>
            exch.contract === nft.contract && exch.tokenID === nft.tokenID
        );
        if (found) nftSummary.options.push(chain);
      });

      this.summarys.push(nftSummary);
    });
  },
};
</script>
<style>
</style>
