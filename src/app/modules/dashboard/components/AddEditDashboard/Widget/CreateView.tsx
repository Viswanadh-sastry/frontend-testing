import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon, toAbsoluteUrl, WidgetParameters } from "../../../../../../_metronic/helpers";
import { getChannelThingList } from "../../../../channels/api/ChannelThingAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";

interface ICreateViewProps {
  selectedLayout: any;
  onCloseAddChart: () => void;
  onGetChartWidgetList: (data: any) => void;
}

const CreateView = ({ selectedLayout, onCloseAddChart, onGetChartWidgetList }: ICreateViewProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const chartSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    devices: Yup.array().min(1, "Device is required"),
    timeline: Yup.number(),
    fromDate: Yup.date(),
    toDate: Yup.date(),
    interval: Yup.number(),
    aggregationType: Yup.string(),
    minValue: Yup.number(),
    maxValue: Yup.number(),
    layout: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      devices: [],
      timeline: 30,
      fromDate: undefined,
      toDate: undefined,
      interval: 1,
      aggregationType: "avg",
      minValue: 0,
      maxValue: 100,
      layout: selectedLayout?.name,
      uniqueDeviceList: [],
      tempSensorTypeList: [],
    },
    validationSchema: chartSchema,
    onSubmit: async (values) => {
      const isValid = await isValidateDevices(values);
      if (!isValid) {
        return;
      }
      onGetChartWidgetList(values);
      onCloseAddChart();
    },
  });

  const isValidateDevices = async (values: any) => {
    const devices: any[] = values.devices;
    const isValid = devices.every((device: any) => device.deviceValue && device.sensorType);
    if (!isValid) {
      toast.info("Device and Sensor Type is required");
      return false;
    }
    const filterGroupChannel = {
      offset: 0,
      limit: 10,
      name: "",
      status: "enabled",
    };
    const deviceList: any[] = [];
    const tempSensorTypeList: string[] = [];
    for (const device of devices) {
      if (device.deviceLabel === "thing") {
        const channelListByThingId = await getThingChannelList(device.deviceValue, filterGroupChannel);
        if (channelListByThingId.groups) {
          const groupsWithThingId = channelListByThingId.groups.map((group: any) => ({
            channelId: group.id,
            thingName: device.deviceName,
            thingId: device.deviceValue,
            sensorType: device.sensorType,
          }));
          if (groupsWithThingId.length > 0) {
            deviceList.push(groupsWithThingId[0]);
          }
        }
      } else {
        const channelListByGroupId = await getChannelThingList(device.deviceValue, filterGroupChannel);
        if (channelListByGroupId.things) {
          const groupsWithChannelId = channelListByGroupId.things.map((thing: any) => ({
            channelId: device.deviceValue,
            thingName: thing.name,
            thingId: thing.id,
            sensorType: device.sensorType,
          }));
          deviceList.push(...groupsWithChannelId);
        }
      }
      if (!tempSensorTypeList.includes(device.sensorType)) {
        tempSensorTypeList.push(device.sensorType);
      }
    }
    const uniqueDeviceList = deviceList.filter((thing, index, self) => index === self.findIndex((t) => t.thingId === thing.thingId && t.sensorType === thing.sensorType));
    if (deviceList.length !== uniqueDeviceList.length) {
      toast.info("Duplicate device is not allowed");
      return false;
    }
    values.uniqueDeviceList = uniqueDeviceList;
    values.tempSensorTypeList = tempSensorTypeList;

    // if (uniqueDeviceList.length > 5) {
    //   Swal.fire({
    //     heightAuto: false,
    //     icon: "warning",
    //     title: "Create Widget",
    //     text: "Are you sure you want to continue with more than 5 devices?",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes",
    //     confirmButtonColor: "#d33",
    //     cancelButtonText: "No",
    //   }).then((result) => {
    //     console.log("result", result);
    //     if (result.isConfirmed) {
    //       return true;
    //     }
    //   });
    // }
    return true;
  };

  const onChangeTimeline = (e: any) => {
    formik.setFieldValue("timeline", e.target.value);
    if (e.target.value === "0") {
      formik.setFieldValue("fromDate", "");
      formik.setFieldValue("toDate", "");
    } else if (e.target.value === "1") {
      formik.setFieldValue("interval", 1);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_create_view" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add New Widget</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-chart-modal-action="close" onClick={onCloseAddChart} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_create_view_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="Widget Name"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.name && formik.errors.name },
                            { "is-valid": formik.touched.name && !formik.errors.name }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.name && formik.errors.name && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Parameters</label>
                        <WidgetParameters deviceData={formik.values.devices} setDeviceData={(device: any) => formik.setFieldValue("devices", device)} />
                        {formik.touched.devices && formik.errors.devices && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.devices}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="fw-bold fs-6">X-Axis Settings</label>
                      <div className="separator my-3"></div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-9">
                      <div className="fv-row mb-6">
                        <label className="fw-bold text-muted fs-6 mb-2">Timeline</label>
                        {/* <select {...formik.getFieldProps("timeline")} className="form-select form-select form-select-lg fw-bold" name="timeline">
                          <option value="">Select Timeline</option>
                          <option value="7">7 days</option>
                          <option value="15">15 days</option>
                          <option value="30">30 days</option>
                          <option value="90">3 months</option>
                          <option value="180">6 months</option>
                          <option value="360">1 year</option>
                        </select> */}
                        <div className="flex-row mb-6">
                          <label className="m-2 cursor-pointer">
                            <input
                              {...formik.getFieldProps("timeline")}
                              type="radio"
                              name="timeline"
                              value={30}
                              className="form-check-input"
                              onChange={onChangeTimeline}
                              defaultChecked={true}
                            />
                            <span className="fw-bold fs-6 mx-2">1 Month</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={90} className="form-check-input" onChange={onChangeTimeline} />
                            <span className="fw-bold fs-6 mx-2">3 Months</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={180} className="form-check-input" onChange={onChangeTimeline} />
                            <span className="fw-bold fs-6 mx-2">6 Months</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={1} className="form-check-input" onChange={onChangeTimeline} />
                            <span className="fw-bold fs-6 mx-2">Current Day</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={0} className="form-check-input" onChange={onChangeTimeline} />
                            <span className="fw-bold fs-6 mx-2">Custom</span>
                          </label>
                          {String(formik.values.timeline) === "0" && (
                            <label>
                              <div className="d-flex">
                                <input
                                  {...formik.getFieldProps("fromDate")}
                                  type="date"
                                  className="form-control w-150px mx-2"
                                  name="fromDate"
                                  placeholder="From Date"
                                  style={{ colorScheme: ktThemeModeValue || undefined }}
                                />
                                <input
                                  {...formik.getFieldProps("toDate")}
                                  type="date"
                                  className="form-control w-150px"
                                  name="toDate"
                                  placeholder="To Date"
                                  style={{ colorScheme: ktThemeModeValue || undefined }}
                                />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fv-row mb-6">
                        <label className="fw-bold text-muted fs-6 mb-2">Interval</label>
                        <select {...formik.getFieldProps("interval")} className="form-select form-select form-select-lg fw-bold" name="interval">
                          <option value="1">Daily</option>
                          <option value="7">Weekly</option>
                          <option value="15">Half Monthly</option>
                          <option value="30">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <label className="fw-bold fs-6">Y-Axis Settings</label>
                      <div className="separator my-3"></div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="fv-row mb-6">
                        <label className="fw-bold text-muted fs-6 mb-2">Minimum</label>
                        <input {...formik.getFieldProps("minValue")} type="number" name="minValue" placeholder="0" className="form-control mb-3 mb-lg-0" autoComplete="off" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fv-row mb-6">
                        <label className="fw-bold text-muted fs-6 mb-2">Maximum</label>
                        <input {...formik.getFieldProps("maxValue")} type="number" name="maxValue" placeholder="100" className="form-control mb-3 mb-lg-0" autoComplete="off" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="fv-row mb-6">
                        <label className="fw-bold text-muted fs-6 mb-2">Aggregation Type</label>
                        <select {...formik.getFieldProps("aggregationType")} className="form-select form-select form-select-lg fw-bold" name="aggregationType">
                          <option value="avg">Average</option>
                          <option value="min">Minimum</option>
                          <option value="max">Maximum</option>
                          <option value="sum">Sum</option>
                          <option value="latest">Latest</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Layout: {selectedLayout?.name}</label>
                        <div className="overlay me-7">
                          <div className="overlay-wrapper">
                            <img alt="img" className="rounded w-200px" src={toAbsoluteUrl(selectedLayout?.imageUrl)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddChart} className="btn btn-light me-3" data-kt-chart-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    <span className="indicator-label">Submit</span>
                  </button>
                </div>
                {/* end::Actions */}
              </form>
            </div>
            {/* end::Modal body */}
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { CreateView };
