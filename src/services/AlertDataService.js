import http from "../http-common";

class AlertService {
  getAll() {
    return http.get("/alerts");
  }

  get(id) {
    return http.get(`/alerts/${id}`);
  }

  create(data) {
    this.addTimestamp(data);
    console.log("AlertService.create");
    console.log(data);
    return http.post("/alerts", data);
  }

  update(id, data) {
    return http.put(`/alerts/${id}`, data);
  }

  delete(id) {
    return http.delete(`/alerts/${id}`);
  }

  search(queryParams) {
    return http.get(`/alerts/search`, { params: queryParams });
  }

  addTimestamp = (data) => {
    const currentDate = new Date();
    data.timestamp = currentDate;
    return data;
  }
}

export default new AlertService();
