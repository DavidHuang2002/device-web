<template>
  <div>
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryForm" inline>
      <el-form-item label="Device Name">
        <el-input v-model="queryParams.name" placeholder="Device Name" clearable></el-input>
      </el-form-item>
      <el-form-item label="Device Type">
        <el-input v-model="queryParams.type" placeholder="Device Type" clearable></el-input>
      </el-form-item>
      <el-form-item label="Device Status">
        <el-input v-model="queryParams.status" placeholder="Device Status" clearable></el-input>
      </el-form-item>
      <el-form-item label="Last Checkin Date Range">
        <!-- TODO: make custom component - date picker -->
      <el-date-picker
        v-model="queryParams.dateRange"
        type="datetimerange"
        range-separator="to"
        start-placeholder="Start Date"
        end-placeholder="End Date"
        @change="adjustToUTC(queryParams.dateRange)"
      ></el-date-picker>
    </el-form-item>
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
      <el-table :data="devices" style="width: 100%" border>
        <el-table-column prop="id" label="Id" width="55" align="center" fixed show-overflow-tooltip />
        <el-table-column prop="name" label="Name" width="120" align="center" fixed show-overflow-tooltip />
        <el-table-column prop="type" label="Type" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="status" label="Status" width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="location" label="Location" width="120" align="center" show-overflow-tooltip />
        <el-table-column label="Added Date" width="160" align="center" show-overflow-tooltip>
            <template #default="scope">
                {{ formatDate(new Date(scope.row.addedDate), 'YYYY-mm-dd') }}
            </template>
        </el-table-column>
        <el-table-column label="Last Check In Time" width="200" align="center" show-overflow-tooltip>
            <template #default="scope">
                {{ formatDate(new Date(scope.row.lastCheckInTime), 'YYYY-mm-dd HH:MM:SS') }}
            </template>
        </el-table-column>
        <el-table-column prop="notes" label="Notes" width="200" align="center" show-overflow-tooltip />
        <el-table-column label="Operations" width="140" align="center" fixed="right" >
            <template #default="scope">
                <el-button :icon="Edit" size="small" text type="primary" @click="openEditMenu(scope.row)" v-auth="'sysMenu:update'"> Edit </el-button>
                <el-button :icon="Delete" size="small" text type="danger" @click="delMenu(scope.row)"> Delete </el-button>
                <!-- <el-dropdown>
                    <el-button icon="ele-MoreFilled" size="small" text type="primary" style="padding-left: 12px" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item icon="ele-Delete" @click="delMenu(scope.row)" divided> Delete </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown> -->
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
import {formatDate} from '../../utils/dateUtils';

const queryParams = ref({
  name: undefined,
  type: undefined,
  status: undefined,
  dateRange: undefined
});

let devices = ref([]);
const editDialogRef = ref();

const queryIsEmty = ()=>{
  return Object.keys(queryParams.value).every(key => {
    return queryParams.value[key] === undefined;
  });
}


// to adjust the select time into UTC time
// because the date time picked in the picker defaults to local time and there is no easy way to directly pick UTC time. This function automatically change the time to UTC time whenver the user pick a time
const adjustToUTC = (dateRange) => {
  if (dateRange && dateRange.length === 2) {
    dateRange[0].setMinutes(dateRange[0].getMinutes() - dateRange[0].getTimezoneOffset());
    dateRange[1].setMinutes(dateRange[1].getMinutes() - dateRange[1].getTimezoneOffset());
  }
};

const setDeviceTableData = (data) => {
  // process the time to local time
  // data.forEach((item) => {
  //   item.addedDate = new Date(item.addedDate).toLocaleString();
  //   item.lastCheckInTime = new Date(item.lastCheckInTime).toLocaleString();
  // });
  devices.value = data;
};

const handleQuery = () => {
  console.log('handleQuery')
  console.log(queryParams.value)

  if(queryIsEmty()){
    DeviceDataService.getAll()
    .then(response => {
      setDeviceTableData(response.data);
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  } else {
    DeviceDataService.search(queryParams.value)
    .then(response => {
      setDeviceTableData(response.data);
      console.log(response.data);
    })
    .catch(e => {
      console.log(e);
    });
  }
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
