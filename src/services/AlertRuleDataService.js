import http from "../http-common";

class AlertRuleDataService {
    update(id, data) {
        return http.put(`/alertRules/${id}`, data);
    }

    create(data) {
        return http.post("/alertRules", data);
    }
}

export default new AlertRuleDataService();