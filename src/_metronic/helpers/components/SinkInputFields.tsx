import { useState } from "react";
import { HeaderInputFields } from "./HeaderInputFields";

interface ISinkInputFields {
  sink: any;
  setSink: (sink: any) => void;
}

const SinkInputFields = ({ sink, setSink }: ISinkInputFields) => {
  const [inputs, setInputs] = useState<{ sinkType: string; url: string; method: string; dataTemplate: string; headers: any; sendSingle: boolean }[]>(convertObjectToArray(sink));
  const [errors, setErrors] = useState<string[]>([]); // Track validation errors

  const handleAddInput = () => {
    setInputs([...inputs, { sinkType: "rest", url: "", method: "GET", dataTemplate: "", headers: {}, sendSingle: false }]);
    setErrors([...errors, ""]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
    const { name, value } = event.target;
    const updatedInputs: { sinkType: string; url: string; method: string; dataTemplate: string; headers: any; sendSingle: boolean }[] = [...inputs];
    (updatedInputs[index] as any)[name] = value;

    const updatedErrors = [...errors];

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
              <label className="fs-6 mb-2">Headers</label>
              <HeaderInputFields headers={item.headers} setHeaders={(headers: any) => handleChange({ target: { name: "headers", value: headers } } as any, index)} />
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
      dataTemplate: sink[key].dataTemplate,
      headers: sink[key].headers,
      sendSingle: sink[key].sendSingle,
    });
  }
  return sinkArray;
};

// const convertArrayToObject = (sink: any) => {
//   const sinkObject: any = {};
//   sink.forEach((item: any) => {
//     sinkObject[item.sinkType] = { url: item.url, method: item.method, dataTemplate: item.dataTemplate, headers: item.headers, sendSingle: item.sendSingle };
//   });
//   return sinkObject;
// };

export { SinkInputFields };
