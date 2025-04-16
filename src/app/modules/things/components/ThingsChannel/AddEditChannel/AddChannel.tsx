import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { getChannelListAll } from "../../../../channels/api/ChannelsAPI";
import { connectThingChannel } from "../../../api/ThingChannelAPI";

interface IAddChannelProps {
  onCloseAddChannel: () => void;
  onGetChannelList: () => void;
}

const AddChannel = ({ onCloseAddChannel, onGetChannelList }: IAddChannelProps) => {
  const params = useParams();
  const thingId = params.id as string;
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }

  const [channelId, setChannelID] = useState("");
  const [filterChannel, setFilterChannel] = useState({
    offset: 0,
    limit: 100,
    name: "",
    metadata: "",
    status: "enabled",
  });

  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelListAll(filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const channelList = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);

  const ChannelSchema = Yup.object().shape({
    channel_id: Yup.string().required("Asset is required."),
  });

  const formik = useFormik({
    initialValues: {
      channel_id: "",
    },
    validationSchema: ChannelSchema,
    onSubmit: async (values, { setSubmitting }) => {
      connectThingChannel(thingId, values.channel_id)
        .then(() => {
          toast.success("Asset connected successfully");
          onCloseAddChannel();
          onGetChannelList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const selectChannel = (id: string) => {
    setChannelID(id);
    formik.setFieldValue("channel_id", id);
  };

  const onChangeChannel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelID("");
    setFilterChannel({ ...filterChannel, name: e.target.value });
    formik.setFieldValue("channel_id", "");
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_user" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Asset</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-user-modal-action="close" onClick={onCloseAddChannel}>
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
                        <label className="fw-bold fs-6 mb-2">Asset ID</label>

                        <input type="text" name="searchChannel" value={filterChannel.name} placeholder="Search Channel" className="form-control mb-3" onChange={onChangeChannel} />
                        <div className="fv-row mb-3">
                          <div className="list-group scroll-y h-200px">
                            {channelList.length > 0 ? (
                              channelList.map((channel: any) => (
                                <a
                                  role="button"
                                  key={channel.id}
                                  className={`list-group-item list-group-item-action p-3 ${channelId === channel.id ? "active" : ""}`}
                                  onClick={() => selectChannel(channel.id)}
                                  style={
                                    ktThemeModeValue === "dark"
                                      ? { color: "white", backgroundColor: channelId !== channel.id ? "#15171C" : "", borderColor: "var(--bs-secondary)" }
                                      : {}
                                  }
                                >
                                  {channel.name}
                                </a>
                              ))
                            ) : (
                              <div className="text-center">No asset found</div>
                            )}
                          </div>
                        </div>
                        {formik.touched.channel_id && formik.errors.channel_id && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.channel_id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddChannel} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddChannel };
