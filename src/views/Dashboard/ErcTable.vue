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
      <el-table-column label="Token" min-width="130px" prop="page">
        <template v-slot="{ row }"> <erc-card :asset="row" /> </template>
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
import ErcCard from "../../components/UniSwan/ErcCard.vue";
export default {
  name: "erc-table",
  props: ["nfts", "root"],
  components: {
    ErcCard,
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
