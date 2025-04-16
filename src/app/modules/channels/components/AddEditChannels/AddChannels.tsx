import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { ThemeModeComponent } from "../../../../../_metronic/assets/ts/layout";
import { KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import { createChannel, getChannelList } from "../../api/ChannelsAPI";

interface IAddChannelProps {
  onCloseAddChannel: () => void;
  onGetChannelList: () => void;
}

const AddChannels = ({ onCloseAddChannel, onGetChannelList }: IAddChannelProps) => {
  let ktThemeModeValue = localStorage.getItem("kt_theme_mode_value");
  if (ktThemeModeValue === "system") {
    ktThemeModeValue = ThemeModeComponent.getSystemMode() as "light" | "dark";
  }

  const [channelId, setChannelId] = useState("");
  const [filterChannel, setFilterChannel] = useState({
    limit: 10,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
  });

  const channelListQuery = useQuery({
    queryKey: [`channelList`, filterChannel],
    queryFn: async () => getChannelList(filterChannel).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const groupList = useMemo(() => channelListQuery.data?.groups || [], [channelListQuery.data]);

  const channelSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    tags: Yup.string(),
    metadata: Yup.object(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      metadata: {},
      parent_id: "",
    },
    validationSchema: channelSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        name: values.name,
        description: values.description,
        metadata: values.metadata,
        status: "enabled",
      };
      createChannel(data)
        .then(() => {
          toast.success("Asset created successfully");
          onCloseAddChannel();
          onGetChannelList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  const selectChannel = (id: string) => {
    setChannelId(id);
    formik.setFieldValue("parent_id", id);
  };

  const onChangeChannel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChannelId("");
    setFilterChannel({ ...filterChannel, name: e.target.value });
    formik.setFieldValue("parent_id", "");
  };

  // Ensure that the "Asset_Type" key is initialized in metadata
  const initialMetadata = {
    Asset_Type: "",
    ...formik.values.metadata,
  };

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_channel" role="dialog" tabIndex={-1} aria-modal="true">
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Asset</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-channel-modal-action="close" onClick={onCloseAddChannel}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
              {/* end::Close */}
            </div>
            {/* begin::Modal body */}
            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_channel_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                {/* begin::Scroll */}
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="Asset Name"
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
                        <label className="fw-bold fs-6 mb-2">Parent Name</label>
                        <input type="text" name="searchUser" value={filterChannel.name} placeholder="Search Asset" className="form-control mb-3" onChange={onChangeChannel} />
                        <div className="fv-row mb-3">
                          <div className="list-group scroll-y h-200px">
                            {groupList.length > 0 ? (
                              groupList.map((group: any) => (
                                <a
                                  role="button"
                                  key={group.id}
                                  className={`list-group-item list-group-item-action p-3 ${channelId === group.id ? "active" : ""}`}
                                  onClick={() => selectChannel(group.id)}
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
                              <div className="text-center">No asset found</div>
                            )}
                          </div>
                        </div>
                        {formik.touched.parent_id && formik.errors.parent_id && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.parent_id}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {/* Name */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Description</label>
                        <input
                          {...formik.getFieldProps("description")}
                          type="text"
                          name="description"
                          placeholder="Asset Description"
                          className={clsx(
                            "form-control mb-3 mb-lg-0",
                            { "is-invalid": formik.touched.description && formik.errors.description },
                            { "is-valid": formik.touched.description && !formik.errors.description }
                          )}
                          autoComplete="off"
                        />
                        {formik.touched.description && formik.errors.description && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.description}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    {/* Metadata */}
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Metadata</label>
                        <MetadataInputFields metadata={initialMetadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                        <label className="fs-6 text-muted">Enter asset metadata in JSON format.</label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddChannel} className="btn btn-light me-3" data-kt-channel-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddChannels };
