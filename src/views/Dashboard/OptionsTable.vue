<template>
  <card header-classes="bg-transparent">
    <!-- <h3 slot="header" class="mb-0">
      Swap options
    </h3> -->
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <div
      style="border-bottom:1px solid red;margin-bottom:10px;"
      v-for="(nftOptions, id) in options"
      :key="'nftchain' + id">
        <!-- <pre>{{nftOptions}}</pre> -->
        <b-button
          @click="root.viewSwapChain(nftOptions)"
          v-b-modal.modalSwapChain size="sm" variant="secondary">
          Swap details
        </b-button>
        <br>
        <br>
        <el-table class="table-responsive table"
          :data="nftOptions"
          header-row-class-name="thead-light">
          <!-- <el-table-column label="wisher"
            min-width="130px"
            prop="page">
            <template v-slot="{row}">
              {{row.wisher.substr(0,6)}}
            </template>
          </el-table-column> -->
          <el-table-column label="To receive"
            min-width="130px"
            prop="page">
            <template v-slot="{row}">
              <bundle :bundle="row.exchangeBundle" :root="root"/>
            </template>
          </el-table-column>
          <el-table-column label="Give away"
             min-width="130px"
             prop="page">
            <template v-slot="{row}">
              <bundle :bundle="row.wishBundle" :root="root"/>
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
