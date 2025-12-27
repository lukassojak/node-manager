import http from "./http"


export function fetchNodes() {
    return http.get("/nodes/")
}

export function fetchNodeById(nodeId) {
    return http.get(`/nodes/${nodeId}`)
}

export function createNode(data) {
    return http.post("/nodes/", data)
}

export function fetchZoneById(nodeId, zoneId) {
    return http.get(`/nodes/${nodeId}/zones/${zoneId}`)
}