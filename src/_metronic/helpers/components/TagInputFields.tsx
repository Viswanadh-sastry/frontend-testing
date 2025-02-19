import { useState } from "react";

interface ITagInputFields {
  tags: any;
  setTags: (tags: any) => void;
}

const TagInputFields = ({ tags, setTags }: ITagInputFields) => {
  const [inputs, setInputs] = useState<{ key: string; value: any }[]>(convertObjectToArray(tags));
  const [errors, setErrors] = useState<string[]>([]); // Track validation errors

  const handleAddInput = () => {
    setInputs([...inputs, { key: "", value: "" }]);
    setErrors([...errors, ""]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = event.target;
    const updatedInputs: { key: string; value: any }[] = [...inputs];
    (updatedInputs[index] as any)[name] = value;

    // Validate the value if the key is "Phone_Number"
    const updatedErrors = [...errors];
    if (name === "value" && updatedInputs[index].key.toLowerCase() === "phone_number") {
      if (!/^\d{10}$/.test(value)) {
        updatedErrors[index] = "Phone number must be exactly 10 digits.";
      }
      // 0000000000 is not a valid phone number
      else if (value === "0000000000") {
        updatedErrors[index] = "Phone number cannot be all zeros.";
      } else {
        updatedErrors[index] = "";
      }
    }

    // Validate the value if the key is "Update_Frequency"
    if (name === "value" && updatedInputs[index].key.toLowerCase() === "update_frequency") {
      if (!/^\d+$/.test(value)) {
        updatedErrors[index] = "Update frequency must be a positive integer.";
      }
      // 0 is not a valid update frequency
      else if (parseInt(value) === 0) {
        updatedErrors[index] = "Update frequency must be greater than 0.";
      } else {
        updatedErrors[index] = "";
      }
    }

    setInputs(updatedInputs);
    setErrors(updatedErrors);
    setTags(convertArrayToObject(updatedInputs));
  };

  const handleDeleteInput = (index: number) => {
    const updatedInputs = [...inputs];
    const updatedErrors = [...errors];
    updatedInputs.splice(index, 1);
    updatedErrors.splice(index, 1);

    setInputs(updatedInputs);
    setErrors(updatedErrors);
    setTags(convertArrayToObject(updatedInputs));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-5">
            <input name="key" type="text" placeholder="Key" className="form-control" value={item.key} onChange={(event) => handleChange(event, index)} />
          </div>
          <div className="col-md-5">
            {item.key.toLowerCase() === "phone_number" || item.key.toLowerCase() === "update_frequency" ? (
              <input
                name="value"
                type="number"
                placeholder="Value"
                className={`form-control ${errors[index] ? "is-invalid" : ""}`}
                value={item.value}
                onChange={(event) => handleChange(event, index)}
              />
            ) : (
              <input name="value" type="text" placeholder="Value" className="form-control" value={item.value} onChange={(event) => handleChange(event, index)} />
            )}
            {errors[index] && <div className="invalid-feedback">{errors[index]}</div>}
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

const convertObjectToArray = (tags: any) => {
  const tagsArray = [];
  for (const key in tags) {
    tagsArray.push({ key: key, value: tags[key] });
  }
  return tagsArray;
};

const convertArrayToObject = (tags: any) => {
  const tagsObject: any = {};
  tags.forEach((item: any) => {
    tagsObject[item.key] = item.value;
  });
  return tagsObject;
};

export { TagInputFields };
