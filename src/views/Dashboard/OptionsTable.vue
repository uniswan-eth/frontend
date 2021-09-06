<template>
  <card header-classes="bg-transparent">
    <!-- <h3 slot="header" class="mb-0">
      Swap options
    </h3> -->
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <div
      style="border-bottom:1px solid red;"
      v-for="(nftOptions, id) in options"
      :key="'nftchain' + id">
        <!-- <pre>{{nftOptions}}</pre> -->
        <el-table class="table-responsive table"
          :data="nftOptions"
          header-row-class-name="thead-light">
          <el-table-column label=""
            min-width="130px"
            prop="page">
            <template v-slot="{row}">
              <!-- @click="root.viewSwapChain([row])" -->
              <b-button
                @click="root.viewSwapChain(nftOptions)"
                v-b-modal.modalSwapChain size="sm" variant="success">
                Details
              </b-button>
            </template>
          </el-table-column>
          <el-table-column label="Exchange"
            min-width="130px"
            prop="page">
            <template v-slot="{row}">
              <bundle :bundle="row.exchangeBundle"/>
            </template>
          </el-table-column>
          <el-table-column label="Wish"
             min-width="130px"
             prop="page">
            <template v-slot="{row}">
              <bundle :bundle="row.wishBundle"/>
            </template>
          </el-table-column>
        </el-table>
    </div>
  </card>
</template>
<script>
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  import Bundle from '@/components/UniSwan/Bundle';

  export default {
    name: 'options-table',
    props: ["options", "root"],
    components: {
      Bundle,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Dropdown.name]: Dropdown,
      [DropdownItem.name]: DropdownItem,
      [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {
      }
    }
  }
</script>
<style>
</style>
