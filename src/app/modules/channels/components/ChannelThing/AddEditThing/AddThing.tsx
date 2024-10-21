import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { getThingListAll } from "../../../../things/api/ThingAPI";
import { connectChannelThing } from "../../../api/ChannelThingAPI";

interface IAddThingProps {
  onCloseAddThing: () => void;
  onGetThingList: () => void;
}

const AddThing = ({ onCloseAddThing, onGetThingList }: IAddThingProps) => {
  const params = useParams();
  const channelId = params.id as string;
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const thingSchema = Yup.object().shape({
    thing_id: Yup.string().required("Device is required"),
  });

  const [thingId, setThingID] = useState("");
  const [filterThing, setFilterThing] = useState({
    offset: 0,
    limit: 100,
    name: "",
    metadata: "",
    status: "enabled",
  });

  const thingListQuery = useQuery({
    queryKey: [`thingList`, filterThing],
    queryFn: async () => getThingListAll(filterThing).catch((error) => toast.error(error.message)),
    enabled: true,
  });

  const thingList = useMemo(() => thingListQuery.data?.things || [], [thingListQuery.data]);

  const formik = useFormik({
    initialValues: {
      thing_id: "",
    },
    validationSchema: thingSchema,
    onSubmit: async (values, { setSubmitting }) => {
      connectChannelThing(channelId, values.thing_id)
        .then(() => {
          toast.success("Device connected successfully");
          onCloseAddThing();
          onGetThingList();
        })
        .catch((error) => toast.error(error.message))
        .finally(() => setSubmitting(false));
    },
  });

  const selectThing = (id: string) => {
    setThingID(id);
    formik.setFieldValue("thing_id", id);
  };

  const onChangeThing = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThingID("");
    setFilterThing({ ...filterThing, name: e.target.value });
    formik.setFieldValue("thing_id", "");
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_thing" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Device</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-thing-modal-action="close" onClick={onCloseAddThing} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add__form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Device ID</label>

                        <input type="text" name="searchthing" value={filterThing.name} placeholder="Search Device" className="form-control mb-3" onChange={onChangeThing} />
                        <div className="fv-row mb-3">
                          <div className="list-group scroll-y h-200px">
                            {thingList.length > 0 ? (
                              thingList.map((thing: any) => (
                                <a
                                  role="button"
                                  key={thing.id}
                                  className={`list-group-item list-group-item-action p-3 ${thingId === thing.id ? "active" : ""}`}
                                  onClick={() => selectThing(thing.id)}
                                  style={
                                    ktThemeModeValue === "dark"
                                      ? { color: "white", backgroundColor: thingId !== thing.id ? "#15171C" : "", borderColor: "var(--bs-secondary)" }
                                      : {}
                                  }
                                >
                                  {thing.name}
                                </a>
                              ))
                            ) : (
                              <div className="text-center">No device found</div>
                            )}
                          </div>
                        </div>
                        {formik.touched.thing_id && formik.errors.thing_id && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.thing_id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddThing} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddThing };
