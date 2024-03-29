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
    <options-table :root="$parent" :options="[chain]">
      <template v-slot:unsHeader>
        <b-row align-v="center">
          <b-col>
            <h3 class="mb-0">Ring swaps</h3>
          </b-col>
          <b-col class="text-right"> </b-col>
        </b-row>
      </template>
    </options-table>

    <div>
      <h3>You will receive:</h3>
      <span v-for="(asset, jdx) in $props.receiveBundle" :key="'wish' + jdx">
        <div
          v-if="asset.metadata"
          class="imgHolder"
          @click="
            $router.push(
              '/nft/' + asset.contract_address + '/' + asset.token_id
            )
          "
          :style="{
            backgroundImage: 'url(' + asset.metadata.image + ')',
          }"
        />
        <div v-if="!asset.metadata" class="imgHolder">
          {{ asset.symbol }}
        </div>
      </span>
    </div>

    <div>
      <h3>Approvals</h3>
      <span v-for="(n, idx) in approvals" :key="'appr' + idx">
        <h4>{{ n.contract_address }}</h4>
        <base-button :disabled="n.isApproved === true" @click="setApproval(idx)"
          >Approve</base-button
        >
      </span>
    </div>
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
  props: ["chain", "receiveBundle"],
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
    return { approvals: [] };
  },
  mounted() {
    this.loadPage();
  },
  methods: {
    async loadPage() {
      this.approvals = [];
      if (this.$props.chain) {
        this.$props.chain[0].wishBundle.map(async (x) =>
          this.approvals.push({
            contract_address: x.contract_address,
            isApproved: await this.$parent.isApproved(
              x.contract_address,
              this.$parent.signeraddr
            ),
          })
        );
      }
    },
    async setApproval(i) {
      await this.$parent.approveTransfers(
        this.approvals[i].contract_address,
        this.$parent.signeraddr
      );
      this.approvals[i].isApproved = true;
    },
  },
};
</script>
<style>
</style>
