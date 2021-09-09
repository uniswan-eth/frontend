<template>
  <card header-classes="bg-transparent">
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <div
      style="border-bottom: 1px solid red; margin-bottom: 10px"
      v-for="(nftOptions, id) in options"
      :key="'nftchain' + id"
    >
      <br />
      <div v-if="display === 'simple'">
        <bundle
          style="margin-right: 20px"
          display="medium"
          :bundle="nftOptions[nftOptions.length - 1].exchangeBundle"
          :root="root"
        >
          <template v-slot:bundleHeader>
            <!-- Hello from options -->
            <b-button
              @click="
                $event.preventDefault();
                root.viewSwapChain(nftOptions);
              "
              v-b-modal.modalSwapChain
              size="sm"
              variant="secondary"
            >
              <span>
                {{
                  nftOptions[0].wishBundle[0].owner ===
                  root.signeraddr.toLowerCase()
                    ? "Execute"
                    : "Details"
                }}
              </span>
              <b-badge v-if="nftOptions.length > 1" variant="primary">{{
                nftOptions.length
              }}</b-badge>
            </b-button>
          </template>
        </bundle>
        <!-- In Exchange for -->
        <bundle
          display="medium"
          :bundle="nftOptions[0].wishBundle"
          :root="root"
        >
          <template v-slot:bundleHeader>
            <div style="height: 30px"></div>
          </template>
        </bundle>
        <div class="cb" />
      </div>
      <br />
      <el-table
        v-if="!display"
        class="table-responsive table"
        :data="nftOptions"
        header-row-class-name="thead-light"
      >
        <el-table-column label="Wisher" min-width="130px" prop="page">
          <template v-slot="{ row }">
            <account-card
              :address="row.signedOrder.makerAddress"
              :root="root"
            />
          </template>
        </el-table-column>
        <el-table-column label="Give away" min-width="130px" prop="page">
          <template v-slot="{ row }">
            <bundle :bundle="row.wishBundle" :root="root" />
          </template>
        </el-table-column>
        <el-table-column label="To receive" min-width="130px" prop="page">
          <template v-slot="{ row }">
            <bundle :bundle="row.exchangeBundle" :root="root" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </card>
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
  name: "options-table",
  props: ["options", "root", "display"],
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
