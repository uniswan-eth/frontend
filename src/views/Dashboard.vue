<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-primary">
      <b-row>
        <b-col xl="3" md="6">
          <stats-card title="NFTs"
                      type="gradient-red"
                      :sub-title="$parent.$parent.usernfts.length.toString()"
                      icon="ni ni-active-40"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Offers"
                      type="gradient-orange"
                      :sub-title="$parent.$parent.userprefs.length.toString()"
                      icon="ni ni-chart-pie-35"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">12.18%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Options"
                      type="gradient-green"
                      sub-title="356"
                      icon="ni ni-money-coins"
                      class="mb-4">

            <template slot="footer">
              <span class="text-danger mr-2">5.72%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>

        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="History"
                      type="gradient-info"
                      sub-title="346"
                      icon="ni ni-chart-bar-32"
                      class="mb-4">

            <template slot="footer">
              <span class="text-success mr-2">54.8%</span>
              <span class="text-nowrap">Since last month</span>
            </template>
          </stats-card>
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="mt-5">
        <b-col xl="6" class="mb-5 mb-xl-0">
          <nfts-table :nfts="$parent.$parent.usernfts">
            <template v-slot:unsHeader>
              <b-row align-v="center">
                <b-col>
                  <h3 class="mb-0">NFTs</h3>
                </b-col>
                <b-col class="text-right">
                  <a href="#!" class="btn btn-sm btn-primary">See all</a>
                </b-col>
              </b-row>
            </template>
          </nfts-table>
        </b-col>
        <b-col xl="6" class="mb-5 mb-xl-0">
          <offers-table
            :root="$parent.$parent"
            :offers="$parent.$parent.userprefs"></offers-table>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
  // Charts
  import * as chartConfigs from '@/components/Charts/config';
  import LineChart from '@/components/Charts/LineChart';
  import BarChart from '@/components/Charts/BarChart';

  // Components
  import BaseProgress from '@/components/BaseProgress';
  import StatsCard from '@/components/Cards/StatsCard';

  // Tables
  import NftsTable from './Dashboard/NftsTable';
  import OffersTable from './Dashboard/OffersTable';

  export default {
    components: {
      NftsTable,
      OffersTable,
      LineChart,
      BarChart,
      BaseProgress,
      StatsCard,
    },
    data() {
      return {
      };
    },
    mounted() {
      document.title ="🦢 UniSwan"
    },
    methods: {
    },
  };
</script>
<style>
.el-table .cell{
  padding-left: 0px;
  padding-right: 0px;
}
</style>
