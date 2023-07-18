<template>
  <div>
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
				<!-- <el-form-item label="菜单名称">
					<el-input v-model="queryParams.title" placeholder="菜单名称" clearable />
				</el-form-item>
				<el-form-item label="类型">
					<el-select v-model="queryParams.type" placeholder="类型" clearable>
						<el-option label="目录" :value="1" />
						<el-option label="菜单" :value="2" />
						<el-option label="按钮" :value="3" />
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-button-group>
						<el-button type="primary" :icon="Search" @click="handleQuery" > Search </el-button>
						<el-button :icon="Refresh" @click="resetQuery"> Reset </el-button>
					</el-button-group>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :icon="Plus" @click="openAddMenu" v-auth="'sysMenu:add'"> Add </el-button>
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
        <el-table-column label="Operations" width="140" fixed="right" align="center">
					<template #default="scope">
						<el-button :icon="Edit" size="small" text type="primary" @click="openEditMenu(scope.row)" v-auth="'sysMenu:update'"> Edit </el-button>
						<el-button :icon="Delete" size="small" text type="danger" @click="delMenu(scope.row)" v-auth="'sysMenu:delete'"> Delete </el-button>
					</template>
				</el-table-column>
      </el-table>
    </el-card>
  </div>
  <EditDeviceDialog ref="editDialogRef" @deviceAdded="handleDeviceAdded" @deviceEdited="handleDeviceEdited"/>
</template>

<script setup name="deviceView">
import { ref, onMounted } from 'vue';
import DeviceDataService from '../../services/DeviceDataService';
import EditDeviceDialog from './component/EditDeviceDialog.vue';
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue';
import { ElMessageBox, ElMessage } from 'element-plus';


const queryParams = ref({
  title: undefined,
  type: undefined
});

let devices = ref([]);
const editDialogRef = ref();

const handleQuery = () => {
  console.log('queryParam');
  console.log(queryParams.value);
  DeviceDataService.getAll()
    .then(response => {
      devices.value = response.data;
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
};

const resetQuery = () => {
  queryParams.value = {
    title: undefined,
    type: undefined
  }
}

const openAddMenu = () => {
  openEditMenu();
};

const openEditMenu = (row)=>{
  console.log('editDialogRef');
  console.log(editDialogRef);
  console.log(editDialogRef.value);
  
  editDialogRef.value?.openDialog(row);
}

const delMenu = (row) => {
	ElMessageBox.confirm(`Are you sure you want to delete device "${row.name}?"`, 'Confirmation', {
		confirmButtonText: 'Delete',
		cancelButtonText: 'Cancel',
		type: 'warning',
	})
		.then(async () => {
			await DeviceDataService.delete(row.id);
			ElMessage.success('Delete success');
      handleQuery();
		})
		.catch((e) => {console.error(e)});
};

const handleDeviceAdded = () => {
  ElMessage.success("successfully added device");
  handleQuery();
}

const handleDeviceEdited = () => {
  ElMessage.success("successfully edited device");
  handleQuery();
}

onMounted(handleQuery);
</script>

<style scoped>
/* Add custom styles here */
</style>
