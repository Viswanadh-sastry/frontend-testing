import { useState } from "react";
import { HeaderInputFields } from "./HeaderInputFields";

interface ISinkInputFields {
  sink: any;
  setSink: (sink: any) => void;
}

const SinkInputFields = ({ sink, setSink }: ISinkInputFields) => {
  const [inputs, setInputs] = useState<
    {
      sinkType: string;
      url: string;
      method: string;
      bodyType: string;
      dataTemplate: string;
      headers: any;
      timeout: number;
      debugResp: boolean;
      insecureSkipVerify: boolean;
      sendSingle: boolean;
      options?: {
        concurrency: number;
        bufferLength: number;
        retryInterval: number;
        retryCount: number;
        cacheLength: number;
        cacheSaveInterval: number;
        runAsync: boolean;
        omitIfEmpty: boolean;
      };
    }[]
  >(convertObjectToArray(sink));
  const [errors, setErrors] = useState<string[]>([]); // Track validation errors

  const handleAddInput = () => {
    setInputs([
      ...inputs,
      {
        sinkType: "rest",
        url: "",
        method: "GET",
        bodyType: "json",
        dataTemplate: "",
        headers: {},
        timeout: 5000,
        debugResp: false,
        insecureSkipVerify: true,
        sendSingle: false,
        options: {
          concurrency: 1,
          bufferLength: 1024,
          retryInterval: 1000,
          retryCount: 0,
          cacheLength: 1024,
          cacheSaveInterval: 1000,
          runAsync: false,
          omitIfEmpty: false,
        },
      },
    ]);
    setErrors([...errors, ""]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;
    const updatedInputs: {
      sinkType: string;
      url: string;
      method: string;
      bodyType: string;
      dataTemplate: string;
      headers: any;
      timeout: number;
      debugResp: boolean;
      insecureSkipVerify: boolean;
      sendSingle: boolean;
      options?: {
        concurrency: number;
        bufferLength: number;
        retryInterval: number;
        retryCount: number;
        cacheLength: number;
        cacheSaveInterval: number;
        runAsync: boolean;
        omitIfEmpty: boolean;
      };
    }[] = [...inputs];
    (updatedInputs[index] as any)[name] = value;

    const updatedErrors = [...errors];

    // Validate the input fields
    if (name === "url" && !value) {
      updatedErrors[index] = "URL is required";
    } else {
      updatedErrors[index] = "";
    }

    setInputs(updatedInputs);
    setErrors(updatedErrors);
    // setSink(convertArrayToObject(updatedInputs));
    setSink(updatedInputs);
  };

  const handleDeleteInput = (index: number) => {
    const updatedInputs = [...inputs];
    const updatedErrors = [...errors];
    updatedInputs.splice(index, 1);
    updatedErrors.splice(index, 1);

    setInputs(updatedInputs);
    setErrors(updatedErrors);
    // setSink(convertArrayToObject(updatedInputs));
    setSink(updatedInputs);
  };

  return (
    <div className="form-group">
      {inputs.map((item: any, index: number) => (
        <div key={index}>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Sink Type</label>
              <select name="sinkType" className="form-select" value={item.sinkType} onChange={(event) => handleChange(event, index)}>
                <option value="rest">REST</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Method</label>
              <select name="method" className="form-select" value={item.method} onChange={(event) => handleChange(event, index)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="required fs-6 mb-2">URL</label>
              <input type="text" name="url" className="form-control mb-3 mb-lg-0" value={item.url} onChange={(event) => handleChange(event, index)} placeholder="URL" />
              {errors[index] && <div className="invalid-feedback">{errors[index]}</div>}
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Body Type</label>
              <select name="bodyType" className="form-select" value={item.bodyType} onChange={(event) => handleChange(event, index)}>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Headers</label>
              <HeaderInputFields headers={item.headers} setHeaders={(headers: any) => handleChange({ target: { name: "headers", value: headers } } as any, index)} />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Timeout</label>
              <input
                type="number"
                name="timeout"
                className="form-control mb-3 mb-lg-0"
                value={item.timeout}
                onChange={(event) => handleChange(event, index)}
                placeholder="Timeout"
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Debug Response</label>
              <select name="debugResp" className="form-select" value={item.debugResp} onChange={(event) => handleChange(event, index)}>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Send Single</label>
              <select name="sendSingle" className="form-select" value={item.sendSingle} onChange={(event) => handleChange(event, index)}>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Data Template</label>
              <input
                type="text"
                name="dataTemplate"
                className="form-control mb-3 mb-lg-0"
                value={item.dataTemplate}
                onChange={(event) => handleChange(event, index)}
                placeholder="Data Template"
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <label className="fs-6 mb-2">Insecure Skip Verify</label>
              <select name="insecureSkipVerify" className="form-select" value={item.insecureSkipVerify} onChange={(event) => handleChange(event, index)}>
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="accordion" id="kt_sink_options">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="kt_sink_advanced_options_header">
                    <button
                      className="accordion-button fs-4 fw-semibold collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#kt_sink_advanced_options"
                      aria-expanded="false"
                      aria-controls="kt_sink_advanced_options"
                    >
                      Sink Advanced Options
                    </button>
                  </h2>
                  <div id="kt_sink_advanced_options" className="accordion-collapse collapse" aria-labelledby="kt_sink_advanced_options_header" data-bs-parent="#kt_sink_options">
                    <div className="accordion-body">
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Concurrency</label>
                          <input
                            type="number"
                            name="concurrency"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.concurrency}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Concurrency"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Buffer Length</label>
                          <input
                            type="number"
                            name="bufferLength"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.bufferLength}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Buffer Length"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Retry Interval</label>
                          <input
                            type="number"
                            name="retryInterval"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.retryInterval}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Retry Interval"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Retry Count</label>
                          <input
                            type="number"
                            name="retryCount"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.retryCount}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Retry Count"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Cache Length</label>
                          <input
                            type="number"
                            name="cacheLength"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.cacheLength}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Cache Length"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Cache Save Interval</label>
                          <input
                            type="number"
                            name="cacheSaveInterval"
                            className="form-control mb-3 mb-lg-0"
                            value={item.options?.cacheSaveInterval}
                            onChange={(event) => handleChange(event, index)}
                            placeholder="Cache Save Interval"
                          />
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Run Async</label>
                          <select name="runAsync" className="form-select" value={item.options?.runAsync} onChange={(event) => handleChange(event, index)}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-12">
                          <label className="fs-6 mb-2">Omit If Empty</label>
                          <select name="omitIfEmpty" className="form-select" value={item.options?.omitIfEmpty} onChange={(event) => handleChange(event, index)}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="row">
        <div className="col-md-12">
          <button type="button" className="btn btn-sm btn-light-primary me-2" onClick={() => handleAddInput()}>
            Add
          </button>
          {inputs.length > 0 && (
            <button type="button" className="btn btn-sm btn-light-danger" onClick={() => handleDeleteInput(inputs.length - 1)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const convertObjectToArray = (sink: any) => {
  const sinkArray = [];
  for (const key in sink) {
    sinkArray.push({
      sinkType: sink[key].sinkType,
      url: sink[key].url,
      method: sink[key].method,
      bodyType: sink[key].bodyType,
      dataTemplate: sink[key].dataTemplate,
      headers: sink[key].headers,
      timeout: sink[key].timeout,
      debugResp: sink[key].debugResp || false,
      insecureSkipVerify: sink[key].insecureSkipVerify || false,
      sendSingle: sink[key].sendSingle || false,
      options: {
        concurrency: sink[key].options?.concurrency || 1,
        bufferLength: sink[key].options?.bufferLength || 1024,
        retryInterval: sink[key].options?.retryInterval || 1000,
        retryCount: sink[key].options?.retryCount || 0,
        cacheLength: sink[key].options?.cacheLength || 1024,
        cacheSaveInterval: sink[key].options?.cacheSaveInterval || 1000,
        runAsync: sink[key].options?.runAsync || false,
        omitIfEmpty: sink[key].options?.omitIfEmpty || false,
      },
    });
  }
  return sinkArray;
};

export { SinkInputFields };
