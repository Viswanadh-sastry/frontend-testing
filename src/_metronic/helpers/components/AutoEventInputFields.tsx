import { useState } from "react";

interface IAutoEventInputFields {
  autoEvents: any;
  setAutoEvents: (autoEvents: any) => void;
}

const AutoEventInputFields = ({ autoEvents, setAutoEvents }: IAutoEventInputFields) => {
  const [inputs, setInputs] = useState(convertObjectToArray(autoEvents));

  const handleAddInput = () => {
    setInputs([...inputs, { interval: "", unit: "ms", onchange: "false", resource: "json" }]);
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setAutoEvents(convertObjectToArray(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setAutoEvents(convertObjectToArray(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-4">
            <div className="input-group">
              <input name="interval" type="number" placeholder="Interval" className="form-control" value={item.interval} onChange={(event) => handleChange(event, index)} />
              <select name="unit" className="form-control" value={item.unit} onChange={(event) => handleChange(event, index)}>
                <option value="ms">Milliseconds</option>
                <option value="s">Seconds</option>
                <option value="m">Minutes</option>
                <option value="h">Hours</option>
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <select name="onchange" className="form-control" value={item.onchange} onChange={(event) => handleChange(event, index)}>
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="col-md-3">
            <select name="resource" className="form-control" value={item.resource} onChange={(event) => handleChange(event, index)}>
              <option value="json">JSON</option>
              <option value="device-info">Device Info</option>
              <option value="int8">Int8</option>
              <option value="int16">Int16</option>
              <option value="int32">Int32</option>
              <option value="int64">Int64</option>
              <option value="uint8">UInt8</option>
              <option value="uint16">UInt16</option>
              <option value="uint32">UInt32</option>
              <option value="uint64">UInt64</option>
              <option value="float32">Float32</option>
              <option value="float64">Float64</option>
              <option value="bool">Bool</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-center">
            {inputs.length > 0 && (
              <button type="button" className="btn btn-sm btn-light-danger" onClick={() => handleDeleteInput(index)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="row">
        <div className="col-md-12">
          <button type="button" className="btn btn-sm btn-light-primary" onClick={() => handleAddInput()}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const convertObjectToArray = (autoEvents: any) => {
  const autoEventsArray: any = [];
  autoEvents.forEach((event: any) => {
    autoEventsArray.push({ interval: event.interval, unit: event.unit, onchange: event.onchange, resource: event.resource });
  });
  return autoEventsArray;
};

export { AutoEventInputFields };
