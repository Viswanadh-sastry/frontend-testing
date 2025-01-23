import { useState } from "react";

interface IEmailChannelInputFields {
  emailChannels: any;
  setEmailChannels: (emailChannel: any) => void;
}

const EmailChannelInputFields = ({ emailChannels, setEmailChannels }: IEmailChannelInputFields) => {
  const [inputs, setInputs] = useState(convertObjectToArray(emailChannels));

  const handleAddInput = () => {
    setInputs([...inputs, { emailRecipient: "" }]);
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setEmailChannels(convertObjectToArray(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setEmailChannels(convertObjectToArray(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-10">
            <div className="input-group">
              <input
                name="emailRecipient"
                type="text"
                placeholder="Email Recipient"
                className="form-control"
                value={item.emailRecipient}
                onChange={(event) => handleChange(event, index)}
              />
            </div>
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

const convertObjectToArray = (emailChannel: any) => {
  const emailChannelArray: any = [];
  emailChannel.forEach((event: any) => {
    emailChannelArray.push({ emailRecipient: event.emailRecipient });
  });
  return emailChannelArray;
};

export { EmailChannelInputFields };
