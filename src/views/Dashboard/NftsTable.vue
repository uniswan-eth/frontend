<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <el-table
      class="table-responsive table"
      :data="nfts"
      header-row-class-name="thead-light"
    >
      <el-table-column label="NFT" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <nft-card v-if="row.tokenJSON" :nft="row" :root="root" />
          <erc-card v-if="!row.tokenJSON" :asset="row" />
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>
<script>
import NftCard from "@/components/UniSwan/NftCard";
import ErcCard from "@/components/UniSwan/ErcCard";

import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";
export default {
  name: "nfts-table",
  props: ["nfts", "root"],
  components: {
    ErcCard,
    NftCard,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Dropdown.name]: Dropdown,
    [DropdownItem.name]: DropdownItem,
    [DropdownMenu.name]: DropdownMenu,
  },
  data() {
    return {};
  },
};
</script>
<style>
</style>