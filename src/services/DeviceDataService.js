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

  // some helpers
  appendAddedDate = (data) => {
    const currentDate = new Date();
    data.addedDate = currentDate;
    return data;
  }
}

export default new DeviceDataService();