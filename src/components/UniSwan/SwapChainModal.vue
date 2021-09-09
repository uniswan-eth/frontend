<template>
  <b-modal
    id="modalSwapChain"
    v-if="chain"
    size="lg"
    modal-classes="modal-danger"
    modal-content-classes="bg-gradient-danger"
  >
    <div class="py-3 text-center">
      <i class="ni ni-bell-55 ni-3x"></i>
      <h4 class="heading mt-4">Swap chain</h4>
      <p>The owner of the wish bundle can execute this order.</p>
    </div>
    <options-table :root="$parent.$parent" :options="[chain]">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Ring swaps</h3>
          </b-col>
          <b-col class="text-right"> </b-col>
        </b-row>
      </template>
    </options-table>

    <template slot="modal-footer">
      <base-button @click="$parent.executeSwap(chain)" type="success"
        >Execute offer</base-button
      >
      <br />
    </template>
  </b-modal>
</template>
<script>
import Bundle from "@/components/UniSwan/Bundle";
import OptionsTable from "@/views/Dashboard/OptionsTable";

import {
  Table,
  TableColumn,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "element-ui";

export default {
  name: "swap-chain-modal",
  props: ["chain"],
  components: {
    OptionsTable,
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
  methods: {},
};
</script>
<style>
</style>
