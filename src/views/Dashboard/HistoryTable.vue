<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <b-row align-v="center">
        <b-col>
          <h3 class="mb-0">Swap history</h3>
        </b-col>
      </b-row>
    </template>
    <el-table
      class="table-responsive table"
      :data="events"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Block number" min-width="130px" prop="page">
        <template v-slot="{ row }">
          {{ row.blockNumber }}
        </template>
      </el-table-column>
      <el-table-column label="Event type" min-width="130px" prop="page">
        <template v-slot="{ row }">
          {{ row.eventSignature }}
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
    return {};
  },
};
</script>
<style>
</style>
