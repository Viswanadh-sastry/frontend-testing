import clsx from "clsx";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon, toAbsoluteUrl, WidgetParameters } from "../../../../../../_metronic/helpers";
import { getChannelThingList } from "../../../../channels/api/ChannelThingAPI";
import { getThingChannelList } from "../../../../things/api/ThingChannelAPI";

interface ICreateViewProps {
  selectedLayout: any;
  onCloseAddChart: () => void;
  onGetPreviewWidgetList: (data: any) => void;
}

const CreateView = ({ selectedLayout, onCloseAddChart, onGetPreviewWidgetList }: ICreateViewProps) => {
  const chartSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    devices: Yup.array().min(1, "Device is required"),
    timeline: Yup.number(),
    fromDate: Yup.date(),
    toDate: Yup.date(),
    interval: Yup.string(),
    layout: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      devices: [],
      timeline: 30,
      fromDate: undefined,
      toDate: undefined,
      interval: "",
      layout: selectedLayout?.name,
      uniqueDeviceList: [],
      tempSensorTypeList: [],
    },
    validationSchema: chartSchema,
    onSubmit: async (values) => {
      const isValid = await isValidateDevices();
      if (!isValid) {
        return;
      }
      onGetPreviewWidgetList(values);
      onCloseAddChart();
    },
  });

  const isValidateDevices = async () => {
    const devices: any[] = formik.values.devices;
    const isValid = devices.every((device: any) => device.deviceValue && device.sensorType);
    if (!isValid) {
      toast.error("Device and Sensor Type is required");
      return false;
    }
    const filterGroupChannel = {
      offset: 0,
      limit: 100,
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
          }));
          deviceList.push(...groupsWithChannelId);
        }
      }
      console.log("device.sensorType", device.sensorType);
      if (!tempSensorTypeList.includes(device.sensorType)) {
        tempSensorTypeList.push(device.sensorType);
      }
    }
    const uniqueDeviceList = deviceList.filter((thing, index, self) => index === self.findIndex((t) => t.thingId === thing.thingId));
    formik.setFieldValue("uniqueDeviceList", uniqueDeviceList);
    formik.setFieldValue("tempSensorTypeList", tempSensorTypeList);
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
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Timeline</label>
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
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={30} className="form-check-input" defaultChecked={true} />
                            <span className="fw-bold fs-6 mx-2">1 Month</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={90} className="form-check-input" />
                            <span className="fw-bold fs-6 mx-2">3 Months</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={180} className="form-check-input" />
                            <span className="fw-bold fs-6 mx-2">6 Months</span>
                          </label>
                          <label className="m-2 cursor-pointer">
                            <input {...formik.getFieldProps("timeline")} type="radio" name="timeline" value={0} className="form-check-input" />
                            <span className="fw-bold fs-6 mx-2">Custom</span>
                          </label>
                          {String(formik.values.timeline) === "0" && (
                            <label>
                              <div className="d-flex">
                                <input {...formik.getFieldProps("fromDate")} type="date" className="form-control w-150px mx-2" name="fromDate" placeholder="From Date" />
                                <input {...formik.getFieldProps("toDate")} type="date" className="form-control w-150px" name="toDate" placeholder="To Date" />
                              </div>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Interval</label>
                        <select {...formik.getFieldProps("interval")} className="form-select form-select form-select-lg fw-bold" name="interval">
                          <option value="">Select Interval</option>
                          <option value="10s">10s</option>
                          <option value="30s">30s</option>
                          <option value="1m">1m</option>
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
                  <button type="submit" className="btn btn-primary">
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
