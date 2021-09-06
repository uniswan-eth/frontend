<template>
  <b-card body-class="p-0" header-class="border-0">
    <template v-slot:header>
      <slot name="unsHeader"></slot>
    </template>
    <el-table class="table-responsive table"
              :data="nfts"
              header-row-class-name="thead-light">
      <el-table-column label="NFT"
                       min-width="130px"
                       prop="page">
        <template v-slot="{row}">
          <nft-card :nft="row" :root="root"/>
        </template>
      </el-table-column>
    </el-table>
  </b-card>
</template>
<script>
  import NftCard from '@/components/UniSwan/NftCard';
  import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  export default {
    name: 'nfts-table',
    props: ["nfts", "root"],
    components: {
      NftCard,
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
