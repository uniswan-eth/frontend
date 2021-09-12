<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
      <b-row>
        <b-col xl="6" md="6"> </b-col>
      </b-row>
    </base-header>

    <b-container fluid class="mt--7">
      <b-row class="justify-content-center">
        <b-col lg="12">
          <offers-table
            zzdisplay="medium"
            :root="$parent.$parent"
            :offers="orders"
          ></offers-table>
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
      this.$parent.$parent.routeName = "Orders";

      // Query OpenSea
      this.orders = [];
      if (this.$parent.$parent.network.chainId === 137) {
        this.orders = await this.$parent.$parent.orderbook;
      } else if (this.$parent.$parent.network.chainId === 1) {
      }
    },
    async loadOS(offset) {},
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
