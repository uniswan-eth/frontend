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
              <!-- <span class="text-success mr-2">3.48%</span>
              <span class="text-nowrap">Since last month</span> -->
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
              <!-- <span class="text-success mr-2">12.18%</span>
              <span class="text-nowrap">Since last month</span> -->
            </template>
          </stats-card>
        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="Options"
                      type="gradient-green"
                      :sub-title="$parent.$parent.userSwapOptions.length.toString()"
                      icon="ni ni-money-coins"
                      class="mb-4">

            <template slot="footer">
              <!-- <span class="text-danger mr-2">5.72%</span>
              <span class="text-nowrap">Since last month</span> -->
            </template>
          </stats-card>

        </b-col>
        <b-col xl="3" md="6">
          <stats-card title="History"
                      type="gradient-info"
                      :sub-title="$parent.$parent.userHistory.length.toString()"
                      icon="ni ni-chart-bar-32"
                      class="mb-4">

            <template slot="footer">
              <!-- <span class="text-success mr-2">54.8%</span>
              <span class="text-nowrap">Since last month</span> -->
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
                <!-- <b-col class="text-right">
                  <a href="#!" class="btn btn-sm btn-primary">See all</a>
                </b-col> -->
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
      <b-row class="mt-5">
        <b-col xl="6" class="mb-5 mb-xl-0">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">
              Swap options
            </h3>
            <div
              style="border-bottom:1px solid red;"
              v-for="(nftOptions, id) in $parent.$parent.userSwapOptions"
              :key="'nftchain' + id">
              <!-- <pre>{{nftOptions}}</pre> -->

              <!-- <div v-for="(chain, idx) in nftOptions" :key="'chain' + idx"> -->
                <el-table class="table-responsive table"
                  :data="nftOptions"
                  header-row-class-name="thead-light">
                  <el-table-column label=""
                    min-width="130px"
                    prop="page">
                    <template v-slot="{row}">
                      <b-button
                        @click="$parent.$parent.viewSwapChain([row])"
                        v-b-modal.modalSwapChain size="sm" variant="success">
                        Swap it!
                      </b-button>
                      <!-- <pre>{{row}}</pre> -->
                      <!-- <bundle :bundle="row.exchangeBundle"/> -->
                    </template>
                  </el-table-column>
                  <el-table-column label="Exchange"
                    min-width="130px"
                    prop="page">
                    <template v-slot="{row}">
                      <bundle :bundle="row.exchangeBundle"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="Wish"
                     min-width="130px"
                     prop="page">
                    <template v-slot="{row}">
                      <bundle :bundle="row.wishBundle"/>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- <bundle :bundle="chain.exchangeBundle" /> -->

                <!-- <pre>{{chain}}</pre>
                <div v-for="(n, idy) in chain" :key="'wnft' + idy">
                  <bundle :bundle="n.exchangeBundle" />
                </div> -->
                <!-- <b-button
                  @click="$parent.$parent.viewSwapChain(chain)"
                  v-b-modal.modalSwapChain size="sm" variant="secondary">
                  Details
                </b-button> -->
                <!-- <hr>
              </div> -->
            </div>
          </card>


          <!-- <pre>{{$parent.$parent.userSwapOptions}}</pre> -->
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
  import Bundle from '@/components/UniSwan/Bundle';
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'

  export default {
    components: {
      Bundle,
      NftsTable,
      OffersTable,
      LineChart,
      BarChart,
      BaseProgress,
      StatsCard,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
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
