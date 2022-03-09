import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    // We are in the server
    return axios.create({
      baseURL:
        // http://SERVICENAME.NAMESPACE.svc.cluster.local
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    // We are in the browser
    return axios.create({ baseURL: "/" });
  }
};
