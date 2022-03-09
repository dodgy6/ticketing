import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      let bodyParams = { ...body };
      if (!!props.token) bodyParams = { ...bodyParams, ...props };
      setErrors(null);
      const request = await axios[method](url, bodyParams);

      if (onSuccess) {
        onSuccess(request.data);
      }

      return request.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err, index) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
