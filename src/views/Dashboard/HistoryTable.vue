<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <b-row align-v="center">
        <b-col>
          <h3 class="mb-0">My orders that have been filled</h3>
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
      <el-table-column label="I sold my" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <bundle :display="display" :bundle="row.exchangeBundle" :root="root">
            <template v-slot:bundleHeader> &nbsp; </template>
          </bundle>
        </template>
      </el-table-column>
      <el-table-column label="I received" min-width="130px" prop="page">
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
              .decodeMultiAssetData(e.args[2])
              .nestedAssetData.map(async (x) => {
                var data721 = assetDataUtils.decodeERC721AssetData(x);

                exchangeBundle.push(
                  await this.$props.root.getTokenFromSubgraph(
                    data721.tokenAddress,
                    data721.tokenId.toNumber()
                  )
                );
              })
          );

          await Promise.all(
            assetDataUtils
              .decodeMultiAssetData(e.args[3])
              .nestedAssetData.map(async (x) => {
                var data721 = assetDataUtils.decodeERC721AssetData(x);

                wishBundle.push(
                  await this.$props.root.getTokenFromSubgraph(
                    data721.tokenAddress,
                    data721.tokenId.toNumber()
                  )
                );
              })
          );
          this.parsedEvents.push({
            blockNumber: e.blockNumber,
            exchangeBundle: exchangeBundle,
            wishBundle: wishBundle,
          });
        })
      );
    },
  },
};
</script>
<style>
</style>
