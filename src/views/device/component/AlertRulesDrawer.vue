<template>
    <el-drawer
      title="Alert Rules"
      size="80%"
      direction="rtl"
      v-model="visible"
    >
      <el-form :model="alertRule" ref="alertRuleForm" >
        <el-form-item label="Rule Name" prop="name" label-width="80px">
            <el-input v-model="alertRule.name"></el-input>
        </el-form-item>
        <el-form-item label="Attribute" prop="attribute">
            <el-input v-model="alertRule.attribute"></el-input>
        </el-form-item>
        <el-form-item label="Attribute Data Type" prop="attributeDataType">
            <el-select v-model="alertRule.attributeDataType" placeholder="Select a data type">
                <el-option
                    v-for="item in dataTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Operator" prop="operator">
            <el-select v-model="alertRule.operator" placeholder="Select an operator">
            <el-option
                v-for="item in operatorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Value" prop="value">
            <el-input v-model="alertRule.value"></el-input>
        </el-form-item>
        <!-- <el-form-item label="Alert Template Name" prop="alertTemplate.alertTemplateName">
            <el-input v-model="alertRule.alertTemplate.alertTemplateName"></el-input>
        </el-form-item> -->
        <el-form-item label="Alert Name" prop="alertTemplate.alertName">
            <el-input v-model="alertRule.alertTemplate.alertName"></el-input>
        </el-form-item>
        <el-form-item label="Severity" prop="alertTemplate.severity">
            <el-input v-model="alertRule.alertTemplate.severity"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="alertTemplate.description">
            <el-input type="textarea" v-model="alertRule.alertTemplate.description"></el-input>
        </el-form-item>
        <el-form-item label="Status" prop="alertTemplate.status">
            <el-input v-model="alertRule.alertTemplate.status"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDrawer">Cancel</el-button>
        <el-button type="primary" @click="submit">Save</el-button>
      </span>
    </el-drawer>
  </template>
  
  <script setup>
  import { ref, defineExpose } from 'vue';
  import DeviceDataService from '../../../services/DeviceDataService';
  import AlertRuleDataService from '../../../services/AlertRuleDataService';
import { ElMessage } from 'element-plus';
  
//   TODO: extract the const into a place
  const dataTypeOptions = [
    { label: 'Int', value: 0 },
    { label: 'Float', value: 1 },
    { label: 'String', value: 2 },
  ]

  const operatorOptions = [
    { label: 'Equals', value: 0 },
    { label: 'NotEquals', value: 1 },
    { label: 'LessThan', value: 2 },
    { label: 'GreaterThan', value: 3 },
    { label: 'LessThanOrEqualTo', value: 4 },
    { label: 'GreaterThanOrEqualTo', value: 5 },
  ]
  const emptyAlertRule = {
        name: null,
        // TODO: make sure the device id is inited
        deviceId: null,
        attribute: null,
        attributeDataType: null,
        operator: null,
        value: null,
        alertTemplate: {
            alertTemplateName: null,
            alertName: null,
            severity: null,
            description: null,
            status: null,
        },
    } 
  let visible = ref(false);
  let alertRule = ref();
  const device = ref();


  const openDrawer = async (deviceVal) => {

    // console.log("DEVICE ID")
    // console.log(deviceId)
    device.value = deviceVal;    
    let alertRules = (await DeviceDataService.getAlertRules(deviceVal.id)).data;
    console.log("Alert rules")
    console.log(alertRules)
    if(alertRules.length > 0){ 
        alertRule.value = alertRules[0];
    } else {
        alertRule.value = emptyAlertRule;
    }
    
    visible.value = true;
  };
  const closeDrawer = async ()=>{
    visible.value = false;
  }

  const submit = async () => {
    if(alertRule.value.id != null){
        console.log("edit alert rule")
        await AlertRuleDataService.update(alertRule.value.id, alertRule.value);
        ElMessage.success("edited alert rule successfully");
    } else {
        console.log("create alert rule")
        await AlertRuleDataService.create(alertRule.value);
        ElMessage.success("created alert rule successfully");
    }
    closeDrawer();
  };
  
  defineExpose({ openDrawer });
</script>
  