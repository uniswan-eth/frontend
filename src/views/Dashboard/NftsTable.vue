<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <bundle :bundle="nfts" :root="root">
      <template v-slot:bundleHeader> &nbsp; </template>
    </bundle>
  </b-card>
</template>
<script>
import Bundle from "@/components/UniSwan/Bundle";

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
