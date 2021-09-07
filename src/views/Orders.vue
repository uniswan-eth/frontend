<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="6" md="6">
          <!-- <stats-card title="Orders"
                      type="gradient-red"
                      sub-title="4,514"
                      icon="ni ni-active-40"
                      class="mb-4">

            <template slot="footer">
            </template>
          </stats-card> -->
        </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <card header-classes="bg-transparent">
            <h3 slot="header" class="mb-0">Latest Orders</h3>
            <offers-table
              display="medium"
              :root="$parent.$parent"
              :offers="orders"
            ></offers-table>
          </card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import BaseHeader from "@/components/BaseHeader";
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";
import OffersTable from "./Dashboard/OffersTable";

Vue.use(VueClipboard);
export default {
  name: "orders",
  components: {
    OffersTable,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
    BaseHeader,
  },
  data() {
    return {
      orders: [],
    };
  },
  async mounted() {
    document.title = "🦢 Orders";
    this.loadPage();
  },
  methods: {
    async loadPage() {
      // Query OpenSea
      this.orders = [];
      console.log("Network", this.$parent.$parent.network.chainId);
      if (this.$parent.$parent.network.chainId === 137) {
        // Matic
        this.orders = await this.$parent.$parent.getPreferences();
        console.log("Orders", this.orders);
      } else if (this.$parent.$parent.network.chainId === 1) {
        // Main net
        // this.loadOS(0)
      }
    },
    async loadOS(offset) {},
    onCopy() {
      this.$notify({
        type: "info",
        message: "Copied to clipboard",
      });
    },
  },
  watch: {
    async $route() {
      // this.assets = []
      this.orders = [];
      // this.collection = null
      // this.offset = 0
      this.loadPage();
    },
  },
};
</script>
<style></style>
