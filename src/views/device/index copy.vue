<!-- TODO: add icons -->

<template>
  <div>
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
				<el-form-item label="菜单名称">
					<el-input v-model="queryParams.title" placeholder="菜单名称" clearable />
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="queryParams.type" placeholder="类型" clearable>
						<el-option label="目录" :value="1" />
						<el-option label="菜单" :value="2" />
						<el-option label="按钮" :value="3" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button-group>
						<el-button type="primary" :icon="Search" @click="handleQuery" > 查询 </el-button>
						<el-button icon="ele-Refresh" @click="resetQuery"> 重置 </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="ele-Plus" @click="openAddMenu" v-auth="'sysMenu:add'"> 新增 </el-button>
				</el-form-item>
			</el-form>
    </el-card>
  </div>
  
  <div class="device-table-container">
    <el-card class="box-card">
      <el-table :data="devices">
        <el-table-column prop="id" label="Id"></el-table-column>
        <el-table-column prop="name" label="Name"></el-table-column>
        <el-table-column prop="type" label="Type"></el-table-column>
        <el-table-column prop="status" label="Status"></el-table-column>
        <el-table-column prop="location" label="Location"></el-table-column>
        <el-table-column prop="addedDate" label="Added Date"></el-table-column>
        <el-table-column prop="lastCheckInTime" label="Last Check In Time"></el-table-column>
        <el-table-column prop="notes" label="Notes"></el-table-column>
      </el-table>
    </el-card>
  </div>
  <EditDeviceDialog ref="editDialogRef" :editDialogVisible="editDialogVisible" />
</template>

<script>
import { ref } from 'vue';
import DeviceDataService from '../../services/DeviceDataService';
import EditDeviceDialog from './component/EditDeviceDialog.vue';
import { Search } from '@element-plus/icons-vue'


export default {
  name: 'DeviceTable',

  // setup(){
  //   // TODO: get ref using OptionAPI
  //   const editDialogRef = ref();
  // },

  data() {
    return {
      queryParams: {
        title: undefined,
        type: undefined
      },
      devices: [],
      // editDialogRef: undefined,
    };
  },

  methods: {
    handleQuery() {
      console.log('queryParam');
      console.log(this.queryParams);
      DeviceDataService.getAll()
        .then(response => {
          this.devices = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    handleReset() {

    },

    openAddMenu() {
      console.log('editDialogRef');
      console.log(this.$refs.editDialogRef);
      console.log(this.$refs.editDialogRef.value);
      
      this.$refs.editDialogRef?.openDialog();
    },
  },

  async mounted() {
    this.handleQuery();
  },
};
</script>

<style scoped>
/* Add custom styles here */
</style>
