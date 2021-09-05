<template>
  <div class="">
    <div class="avatar-group">
      <nft-card
        v-for="(n,idx) in bundle"
        :key="'id'+idx"
        :nft="n"/>
    </div>
  </div>
</template>
<script>
  // import { Table, TableColumn, DropdownMenu, DropdownItem, Dropdown} from 'element-ui'
  import NftCard from '@/components/UniSwan/NftCard';
  export default {
    name: 'bundle',
    props: ["bundle"],
    components: {
      NftCard
      // [Table.name]: Table,
      // [TableColumn.name]: TableColumn,
      // [Dropdown.name]: Dropdown,
      // [DropdownItem.name]: DropdownItem,
      // [DropdownMenu.name]: DropdownMenu,
    },
    data() {
      return {

      }
    }
  }
</script>
<style>
</style>
