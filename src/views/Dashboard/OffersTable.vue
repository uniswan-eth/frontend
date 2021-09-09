<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <b-row align-v="center">
        <b-col>
          <h3 class="mb-0">Offers</h3>
        </b-col>
      </b-row>
    </template>
    <el-table
      class="table-responsive table"
      :data="offers"
      header-row-class-name="thead-light"
    >
      <el-table-column label="Wish" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <bundle :display="display" :bundle="row.wishBundle" :root="root">
            <template v-slot:bundleHeader> &nbsp; </template>
          </bundle>
        </template>
      </el-table-column>
      <el-table-column label="Exchange" min-width="130px" prop="page">
        <template v-slot="{ row }">
          <bundle :display="display" :bundle="row.exchangeBundle" :root="root">
            <template v-slot:bundleHeader> &nbsp; </template>
          </bundle>
        </template>
      </el-table-column>
      <el-table-column label="Wisher" max-width="30px" prop="page">
        <template v-slot="{ row }">
          <b-button
            @click="root.viewOrder(row)"
            v-b-modal.modalOffer
            size="sm"
            variant="secondary"
          >
            View order
          </b-button>
          <br />
          <account-card :address="row.signedOrder.makerAddress" :root="root" />
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
  name: "offers-table",
  props: ["offers", "root", "display"],
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
