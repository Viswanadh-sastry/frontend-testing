import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { toast } from "react-toastify";
import { getChannelListAll } from "../../../app/modules/channels/api/ChannelsAPI";
import { getChannelThingList } from "../../../app/modules/channels/api/ChannelThingAPI";
import { getThing, getThingListAll } from "../../../app/modules/things/api/ThingAPI";

interface IWidgetParameters {
  deviceData: any;
  setDeviceData: (deviceData: any) => void;
  maxDevices?: number;
}

const WidgetParameters = ({ deviceData, setDeviceData, maxDevices = 10 }: IWidgetParameters) => {
  const [inputs, setInputs] = useState(convertArrayToObject(deviceData));
  const [uniqueTags, setUniqueTags] = useState<any[]>([]);
  const filterChannel = {
    limit: 100,
    offset: 0,
    status: "enabled",
  };
  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelListAll(filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
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
    queryFn: async () => getThingListAll(filterDevice).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });
  const deviceList = deviceListQuery.data?.things.map((thing: any) => ({ label: thing.name, value: thing.id })) || [];

  useEffect(() => {
    const fetchTags = async () => {
      const tempUniqueTags: any[] = [];
      for (const item of inputs) {
        if (item.deviceLabel === "thing") {
          const thingDetail = await getThing(item.deviceValue);
          const tags = thingDetail?.tags?.map((tag: string) => ({ label: tag }));
          tempUniqueTags.push(tags);
        } else {
          const thingDetail = await getChannelThingList(item.deviceValue, { limit: 100, offset: 0, status: "enabled" });
          const tags = Array.from(
            new Set((thingDetail?.things.flatMap((thing: any) => thing.tags as string[]) || []).filter((tag: string | undefined) => tag).map((tag: string) => tag.trim()))
          ).map((tag) => ({ label: tag }));
          tempUniqueTags.push(tags);
        }
      }
      setUniqueTags(tempUniqueTags);
    };
    if (uniqueTags.length === 0) {
      fetchTags();
    }
  }, [uniqueTags.length === 0, inputs, deviceData]);

  const selectDevice = async (selected: any, index: number) => {
    const onChangeValue: any = [...inputs];
    if (selected.length > 0) {
      onChangeValue[index]["deviceValue"] = selected[0].value;
      onChangeValue[index]["deviceName"] = selected[0].label;
      onChangeValue[index]["sensorType"] = "";
      if (onChangeValue[index]["deviceLabel"] === "thing") {
        const thingDetail = await getThing(selected[0].value);
        const tags = thingDetail?.tags?.map((tag: string) => ({ label: tag }));
        setUniqueTags([...uniqueTags.slice(0, index), tags, ...uniqueTags.slice(index + 1)]);
      } else {
        const thingDetail = await getChannelThingList(selected[0].value, { limit: 100, offset: 0, status: "enabled" });
        const tags = Array.from(
          new Set(
            (thingDetail?.things.flatMap((thing: any) => thing.tags as string[]) || [])
              .filter((tag: string | undefined) => tag) // Filter out undefined, null, or empty tags
              .map((tag: string) => tag.trim()) // Normalize tags by trimming and converting to lowercase
          )
        ).map((tag) => ({ label: tag }));
        setUniqueTags([...uniqueTags.slice(0, index), tags, ...uniqueTags.slice(index + 1)]);
      }
    } else {
      onChangeValue[index]["deviceValue"] = "";
      onChangeValue[index]["deviceName"] = "";
      onChangeValue[index]["sensorType"] = "";
      setUniqueTags([...uniqueTags.slice(0, index), [], ...uniqueTags.slice(index + 1)]);
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
    if (inputs.length >= maxDevices) {
      if (maxDevices === 1) toast.warn(`Only ${maxDevices} device is allowed.`);
      else toast.warn(`Maximum ${maxDevices} devices are allowed.`);
      return;
    }
    const addDevice = { deviceLabel: "thing", deviceValue: "", deviceName: "", sensorType: "" };
    setInputs([...inputs, addDevice]);
    setDeviceData(convertArrayToObject([...inputs, addDevice]));
    setUniqueTags([...uniqueTags, []]);
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
    setUniqueTags(uniqueTags.filter((tag, i) => i !== index));
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
              options={uniqueTags.length > 0 && uniqueTags[index]?.length > 0 ? uniqueTags[index] : []}
              selected={uniqueTags.length > 0 && uniqueTags[index]?.length > 0 ? uniqueTags[index].filter((tag: any) => tag.label === item.sensorType) : []}
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

const convertArrayToObject = (deviceData: any) => {
  const deviceDataObject: any = [];
  deviceData.forEach((item: any) => {
    deviceDataObject.push({ deviceLabel: item.deviceLabel, deviceValue: item.deviceValue, deviceName: item.deviceName, sensorType: item.sensorType });
  });
  return deviceDataObject;
};

export { WidgetParameters };
