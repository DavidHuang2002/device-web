import http from "../http-common";

class DeviceDataService {
  getAll() {
    return http.get("/devices");
  }

  get(id) {
    return http.get(`/devices/${id}`);
  }

  create(data) {

    this.appendAddedDate(data);
    console.log("DeviceDataService.create");
    console.log(data);
    
    return http.post("/devices", data);
  }

  update(id, data) {
    return http.put(`/devices/${id}`, data);
  }

  delete(id) {
    return http.delete(`/devices/${id}`);
  }

  search(queryParams){
    return http.get(`/devices/search`, {params: this.handleDateRange(queryParams)});
  }

  // some helpers
  appendAddedDate = (data) => {
    const currentDate = new Date();
    data.addedDate = currentDate;
    return data;
  }

  handleDateRange = (queryParams) => {
    if(queryParams.dateRange && queryParams.dateRange.length > 0){
      // avoid modifying the original object
      const newParams = {...queryParams};
      newParams.startDate = queryParams.dateRange[0];
      newParams.endDate = queryParams.dateRange[1];
      console.log("new parmas");
      console.log(newParams);
      return newParams;
    }

    return queryParams;
  }
}

export default new DeviceDataService();