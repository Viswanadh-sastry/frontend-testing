import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getThingList } from "../../../app/modules/things/api/ThingAPI";
import { getChannelList } from "../../../app/modules/channels/api/ChannelsAPI";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

interface IWidgetParameters {
  deviceData: any;
  setDeviceData: (deviceData: any) => void;
}

const WidgetParameters = ({ deviceData, setDeviceData }: IWidgetParameters) => {
  const [inputs, setInputs] = useState(convertObjectToArray(deviceData));
  const filterChannel = {
    limit: 100,
    offset: 0,
    status: "enabled",
  };
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelList(filterChannel).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const channelList = channelListQuery.data?.groups.map((group: any) => ({ label: group.name, value: group.id })) || [];
  const filterDevice = {
    limit: 100,
    offset: 0,
    status: "enabled",
  };
  const deviceListQuery = useQuery({
    queryKey: [`deviceList`, filterDevice],
    queryFn: async () => getThingList(filterDevice).catch((error) => toast.error(error.message)),
    enabled: true,
  });
  const deviceList = deviceListQuery.data?.things.map((thing: any) => ({ label: thing.name, value: thing.id })) || [];
  // Extract and flatten the tags, then remove duplicates
  const uniqueTags = Array.from(
    new Set(
      (deviceListQuery.data?.things.flatMap((thing: any) => thing.tags as string[]) || [])
        .filter((tag: string | undefined) => tag) // Filter out undefined, null, or empty tags
        .map((tag: string) => tag.trim()) // Normalize tags by trimming and converting to lowercase
    )
  ).map((tag) => ({ label: tag }));

  const selectDevice = (selected: any, index: number) => {
    const onChangeValue: any = [...inputs];
    if (selected.length > 0) {
      onChangeValue[index]["deviceValue"] = selected[0].value;
      onChangeValue[index]["deviceName"] = selected[0].label;
    } else {
      onChangeValue[index]["deviceValue"] = "";
      onChangeValue[index]["deviceName"] = "";
    }
    setInputs(onChangeValue);
    setDeviceData(convertArrayToObject(onChangeValue));
  };

  const selectSensorType = (selected: any, index: number) => {
    const onChangeValue: any = [...inputs];
    onChangeValue[index]["sensorType"] = selected.length > 0 ? selected[0].label : "";
    setInputs(onChangeValue);
    setDeviceData(convertArrayToObject(onChangeValue));
  };

  const handleAddInput = () => {
    if (inputs.length >= 5) {
      toast.error("You can add up to 5 devices");
      return;
    }
    const addDevice = { deviceLabel: "thing", deviceValue: "", deviceName: "", sensorType: "" };
    setInputs([...inputs, addDevice]);
    setDeviceData(convertArrayToObject([...inputs, addDevice]));
  };

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;
    const onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
    setDeviceData(convertArrayToObject(onChangeValue));
  };

  const handleDeleteInput = (index: number) => {
    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
    setDeviceData(convertArrayToObject(newArray));
  };

  return (
    <div>
      {inputs.map((item: any, index: number) => (
        <div className="row mb-2" key={index}>
          <div className="col-md-3">
            <select name="deviceLabel" className="form-control" value={item.deviceLabel} onChange={(event) => handleChange(event, index)}>
              <option value="thing">Device</option>
              <option value="channel">Asset</option>
            </select>
          </div>
          <div className="col-md-4">
            <Typeahead
              id="devices"
              labelKey="label"
              options={item.deviceLabel === "thing" ? deviceList : channelList}
              selected={
                item.deviceValue
                  ? item.deviceLabel === "thing"
                    ? deviceList.filter((device: any) => device.value === item.deviceValue)
                    : channelList.filter((channel: any) => channel.value === item.deviceValue)
                  : []
              }
              onChange={(selected: any) => selectDevice(selected, index)}
              placeholder={item.deviceLabel === "thing" ? "Select Device" : "Select Asset"}
            />
          </div>
          <div className="col-md-4">
            <Typeahead
              id="sensorTypes"
              labelKey="label"
              options={uniqueTags}
              selected={uniqueTags.filter((tag) => tag.label === item.sensorType)}
              onChange={(selected: any) => selectSensorType(selected, index)}
              placeholder="Select Sensor Type"
            />
          </div>
          <div className="col-md-1 d-flex align-items-center">
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

const convertObjectToArray = (deviceData: any) => {
  const deviceDataArray: any = [];
  deviceData.forEach((row: any, index: number) => {
    deviceDataArray.push({
      deviceLabel: deviceData[index][row.deviceLabel],
      deviceValue: deviceData[index][row.deviceValue],
      deviceName: deviceData[index][row.deviceName],
      sensorType: deviceData[index][row.sensorType],
    });
  });
  return deviceDataArray;
};

const convertArrayToObject = (deviceData: any) => {
  const deviceDataObject: any = [];
  deviceData.forEach((item: any) => {
    deviceDataObject.push({ deviceLabel: item.deviceLabel, deviceValue: item.deviceValue, deviceName: item.deviceName, sensorType: item.sensorType });
  });
  return deviceDataObject;
};

export { WidgetParameters };
