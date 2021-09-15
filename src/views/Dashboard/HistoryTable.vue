<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <b-row align-v="center">
        <b-col>
          <h3 class="mb-0">Recent swap activity</h3>
        </b-col>
      </b-row>
    </template>
    <el-table
      class="table-responsive table"
      :data="this.parsedEvents"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Block number" min-width="130px" prop="page">
        <template v-slot="{ row }">
          {{ row.blockNumber }}
        </template>
      </el-table-column>
      <el-table-column label="Maker" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <account-card :address="row.makerAddress" :root="root" />
        </template>
      </el-table-column>
      <el-table-column label="Taker" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <account-card :address="row.takerAddress" :root="root" />
        </template>
      </el-table-column>
      <el-table-column label="Maker bundle" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <bundle :display="display" :bundle="row.exchangeBundle" :root="root">
            <template v-slot:bundleHeader> &nbsp; </template>
          </bundle>
        </template>
      </el-table-column>
      <el-table-column label="Taker bundle" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <bundle :display="display" :bundle="row.wishBundle" :root="root">
            <template v-slot:bundleHeader> &nbsp; </template>
          </bundle>
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>
<script>
import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";
import Bundle from "@/components/UniSwan/Bundle";
import AccountCard from "@/components/UniSwan/AccountCard";
import { assetDataUtils } from "@0x/order-utils";

export default {
  name: "history-table",
  props: ["events", "root", "display"],
  components: {
    AccountCard,
    Bundle,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  data() {
    return { parsedEvents: [] };
  },
  async mounted() {
    document.title = "🦢 History";
    this.loadPage();
  },
  methods: {
    async loadPage() {
      this.parsedEvents = [];
      Promise.all(
        this.$props.events.map(async (e) => {
          var exchangeBundle = [];
          var wishBundle = [];

          await Promise.all(
            assetDataUtils
              .decodeMultiAssetDataRecursively(e.args[2])
              .nestedAssetData.map(async (x) => {
                var nftObj = await this.$props.root.getTokenFromSubgraph(
                  x.tokenAddress,
                  x.tokenId.toNumber()
                );

                exchangeBundle.push(nftObj.nft);
              })
          );

          await Promise.all(
            assetDataUtils
              .decodeMultiAssetDataRecursively(e.args[3])
              .nestedAssetData.map(async (x) => {
                var nftObj = await this.$props.root.getTokenFromSubgraph(
                  x.tokenAddress,
                  x.tokenId.toNumber()
                );

                wishBundle.push(nftObj.nft);
              })
          );
          this.parsedEvents.push({
            makerAddress: e.args[0],
            takerAddress: e.args[7],
            blockNumber: e.blockNumber,
            exchangeBundle: exchangeBundle,
            wishBundle: wishBundle,
          });
        })
      );
      console.log("Events2", this.parsedEvents);
    },
  },
};
</script>
<style>
</style>
