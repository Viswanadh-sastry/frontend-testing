import { useState } from "react";

interface IConditionInputFields {
  conditions: any;
  setConditions: (emailChannel: any) => void;
}

const ConditionInputFields = ({ conditions, setConditions }: IConditionInputFields) => {
  const [inputs, setInputs] = useState(convertObjectToArray(conditions));

  const handleAddInput = () => {
    setInputs([...inputs, { conditionText: "", conditionValue: "" }]);
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setConditions(convertObjectToArray(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setConditions(convertObjectToArray(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-2">
            <div className="input-group">
              <select className="form-select form-select-lg w-auto" name="conditionText" value={item.conditionText} onChange={(event) => handleChange(event, index)}>
                <option value="<">&lt;</option>
                <option value=">">&gt;</option>
                <option value="<=">&lt;=</option>
                <option value=">=">&gt;=</option>
                <option value="==">==</option>
                <option value="!=">!=</option>
              </select>
            </div>
          </div>
          <div className="col-md-8">
            <div className="input-group">
              <input name="conditionValue" type="text" placeholder="Value" className="form-control" value={item.conditionValue} onChange={(event) => handleChange(event, index)} />
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

const convertObjectToArray = (conditions: any) => {
  const conditionsArray: any = [];
  conditions.forEach((condition: any) => {
    conditionsArray.push({ conditionText: condition.conditionText, conditionValue: condition.conditionValue });
  });
  return conditionsArray;
};

export { ConditionInputFields };
