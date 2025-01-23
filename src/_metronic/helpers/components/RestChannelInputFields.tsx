import { useState } from "react";

interface IRestChannelInputFields {
  restChannels: any;
  setRestChannels: (restChannel: any) => void;
}

const RestChannelInputFields = ({ restChannels, setRestChannels }: IRestChannelInputFields) => {
  const [inputs, setInputs] = useState(convertObjectToArray(restChannels));

  const handleAddInput = () => {
    setInputs([...inputs, { httpMethod: "GET", host: "", port: "", path: "" }]);
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setRestChannels(convertObjectToArray(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setRestChannels(convertObjectToArray(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-2">
            <div className="input-group">
              <select name="httpMethod" className="form-control" value={item.httpMethod} onChange={(event) => handleChange(event, index)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
                <option value="HEAD">HEAD</option>
                <option value="TRACE">TRACE</option>
                <option value="CONNECT">CONNECT</option>
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <input name="host" type="text" placeholder="Host" className="form-control" value={item.host} onChange={(event) => handleChange(event, index)} />
          </div>
          <div className="col-md-2">
            <input name="port" type="number" placeholder="Port" className="form-control" value={item.port} onChange={(event) => handleChange(event, index)} />
          </div>
          <div className="col-md-3">
            <input name="path" type="text" placeholder="Path" className="form-control" value={item.path} onChange={(event) => handleChange(event, index)} />
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

const convertObjectToArray = (restChannel: any) => {
  const restChannelArray: any = [];
  restChannel.forEach((event: any) => {
    restChannelArray.push({ httpMethod: event.httpMethod, host: event.host, port: event.port, path: event.path });
  });
  return restChannelArray;
};

export { RestChannelInputFields };
