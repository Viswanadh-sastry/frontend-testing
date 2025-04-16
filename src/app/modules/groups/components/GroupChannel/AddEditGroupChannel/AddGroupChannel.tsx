import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { ThemeModeComponent } from "../../../../../../_metronic/assets/ts/layout";
import { getChannelListAll } from "../../../../channels/api/ChannelsAPI";
import { createGroupChannel } from "../../../api/GroupChannelAPI";
import { useParams } from "react-router-dom";

interface IAddGroupChannelProps {
  onCloseAddGroupChannel: () => void;
  onGetGroupChannelList: () => void;
}

const AddGroupChannel = ({ onCloseAddGroupChannel, onGetGroupChannelList }: IAddGroupChannelProps) => {
  const params = useParams();
  const id = params.id as string;
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }
  const [channelId, setChannelId] = useState("");
  const [filterGroupChannel, setFilterGroupChannel] = useState({
    offset: 0,
    limit: 100,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  });

  const channelListQuery = useQuery({
    queryKey: [`ChannelList`, filterGroupChannel],
    queryFn: async () => getChannelListAll(filterGroupChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const channelList = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);

  const GroupSchema = Yup.object().shape({
    channel_ids: Yup.string().required("Asset is required"),
  });

  const formik = useFormik({
    initialValues: {
      channel_ids: "",
    },
    validationSchema: GroupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        channel_ids: [values.channel_ids],
      };
      createGroupChannel(id, data)
        .then(() => {
          toast.success("Asset Group assigned successfully");
          onCloseAddGroupChannel();
          onGetGroupChannelList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const selectGroup = (id: string) => {
    setChannelId(id);
    formik.setFieldValue("channel_ids", id);
  };

  const onChangeGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId("");
    setFilterGroupChannel({ ...filterGroupChannel, name: e.target.value });
    formik.setFieldValue("channel_ids", "");
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_group" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Asset</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-group-modal-action="close" onClick={onCloseAddGroupChannel}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_group_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Asset ID</label>

                        <input type="text" name="searchUser" value={filterGroupChannel.name} placeholder="Search Asset" className="form-control mb-3" onChange={onChangeGroup} />
                        <div className="fv-row mb-3">
                          <div className="list-group scroll-y h-200px">
                            {channelList.length > 0 ? (
                              channelList.map((group: any) => (
                                <a
                                  role="button"
                                  key={group.id}
                                  className={`list-group-item list-group-item-action p-3 ${channelId === group.id ? "active" : ""}`}
                                  onClick={() => selectGroup(group.id)}
                                  style={
                                    ktThemeModeValue === "dark"
                                      ? { color: "white", backgroundColor: channelId !== group.id ? "#15171C" : "", borderColor: "var(--bs-secondary)" }
                                      : {}
                                  }
                                >
                                  {group.name}
                                </a>
                              ))
                            ) : (
                              <div className="text-center">No asset group found</div>
                            )}
                          </div>
                        </div>
                        {formik.touched.channel_ids && formik.errors.channel_ids && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.channel_ids}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddGroupChannel} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddGroupChannel };
