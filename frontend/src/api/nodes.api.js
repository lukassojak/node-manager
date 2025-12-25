import http from "./http"


export function fetchNodes() {
    return http.get("/nodes/")
}