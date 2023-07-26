<template>
    <el-dialog
      title="Add New Device"
      v-model="state.dialogVisible"
      width="30%"
    >
    <el-form :model="device" :rules="rules" ref="deviceForm">
      <el-form-item label="Name" prop="name">
        <el-input v-model="device.name"></el-input>
      </el-form-item>
      <el-form-item label="Type" prop="type">
        <el-input v-model="device.type"></el-input>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-input v-model="device.status"></el-input>
      </el-form-item>
      <el-form-item label="Location" prop="location">
        <el-input v-model="device.location"></el-input>
      </el-form-item>
      <el-form-item label="Last Check-in Time" prop="lastCheckInTime">
        <el-date-picker v-model="device.lastCheckInTime" type="datetime" placeholder="Select date and time" @change="adjustToUTC(device.lastCheckInTime)"></el-date-picker>
      </el-form-item>
      <el-form-item label="Notes" prop="notes">
        <el-input type="textarea" v-model="device.notes"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submit">{{isEditMode()? "Save": "Add"}}</el-button>
      </span>
    </el-dialog>
</template>

<script setup name="editDeviceDialog">
import { reactive, ref } from 'vue';
import DeviceDataService from '../../../services/DeviceDataService';



const defaultFormValues = {
  name: undefined,
  type: undefined,
  status: undefined,
  location: undefined,
  addedDate: undefined,
  lastCheckInTime: undefined,
  notes: undefined
}

const emits = defineEmits(['deviceAdded', 'deviceEdited']);
const deviceForm = ref(defaultFormValues);
const device = ref();
const rules = ref({
  type: [
    { required: true, message: 'Please input type', trigger: 'blur' },
  ],
  status: [
    { required: true, message: 'Please input status', trigger: 'blur' },
  ],
});

const state = reactive({
	dialogVisible: false,
});

const adjustToUTC = (date) => {
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  console.log("date change")
};


const isEditMode = ()=>{
  return device.value.id != undefined;
}

// 打开弹窗
const openDialog = (row) => {
	state.dialogVisible = true;
  if (row != undefined) {
    device.value = row;
  } else {
    device.value = defaultFormValues;
  }
};

// 关闭弹窗
const closeDialog = () => {
	state.dialogVisible = false;
};

// 取消
const cancel = () => {
	state.dialogVisible = false;
};

// 提交
const submit = () => {
  console.log('submit');
  console.log(deviceForm.value);
	deviceForm.value.validate(async (valid) => {
		if (!valid) return;
    console.log("deviceForm")
    console.log(device.value.name)

    if(isEditMode()){
      // edit
      await DeviceDataService.update(device.value.id, device.value);
      closeDialog();
      emits('deviceEdited');
    } else {
      // add
      await DeviceDataService.create(device.value);
      closeDialog();
      emits('deviceAdded');
    }
	});
};

// 导出对象
defineExpose({ openDialog });
</script>
