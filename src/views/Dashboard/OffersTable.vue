<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <b-row align-v="center">
        <b-col>
          <h3 class="mb-0">Offers</h3>
        </b-col>
        <!-- <b-col class="text-right">
          <a href="#!" class="btn btn-sm btn-primary">See all</a>
        </b-col> -->
      </b-row>
    </template>
    <el-table class="table-responsive table"
      :data="offers"
      header-row-class-name="thead-light">
      <el-table-column label=""
         max-width="30px"
         prop="page">
        <template v-slot="{row}">
          <b-button
            @click="root.viewOrder(row)"
            v-b-modal.modalOffer size="sm" variant="secondary">
            Order
          </b-button>
          &nbsp;
          {{row.wisher.substr(0,6)}}
        </template>
      </el-table-column>

      <el-table-column label="Exchange"
                       min-width="130px"
                       prop="page">
        <template v-slot="{row}">
          <bundle :bundle="row.exchangeBundle" :root="root"/>
        </template>
      </el-table-column>
      <el-table-column label="Wish"
                       min-width="130px"
                       prop="page">
        <template v-slot="{row}">
          <bundle :bundle="row.wishBundle" :root="root"/>
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>
<script>
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  import Bundle from '@/components/UniSwan/Bundle';

  export default {
    name: 'offers-table',
    props: ["offers", "root"],
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
