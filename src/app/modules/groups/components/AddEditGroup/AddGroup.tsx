import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useFormik } from "formik";
import { TreeSelect } from "primereact/treeselect";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon, MetadataInputFields } from "../../../../../_metronic/helpers";
import { createGroup, getGroupListAll } from "../../api/GroupAPI";

interface IAddGroupProps {
  onCloseAddGroup: () => void;
  onGetGroupList: () => void;
}

const AddGroup = ({ onCloseAddGroup, onGetGroupList }: IAddGroupProps) => {
  const [nodes, setNodes] = useState<[]>([]);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | undefined>(undefined);

  const filterGroup = {
    limit: 100,
    offset: 0,
    name: "",
    metadata: "",
    parentID: "",
    status: "enabled",
    tree: true,
  };

  const groupListQuery = useQuery({
    queryKey: [`groupList`, filterGroup],
    queryFn: async () => getGroupListAll(filterGroup).catch((error) => toast.error(error?.response?.data?.message || "Something went wrong")),
    enabled: true,
  });

  const transformGroupData = (groups: any) => {
    return groups.map((group: any) => ({
      key: group.id,
      label: group.name,
      data: group,
      icon: `pi pi-fw ${group.children ? "pi-folder" : "pi-file"}`,
      children: group.children ? transformGroupData(group.children) : undefined, // Recursively transform children
    }));
  };

  useEffect(() => {
    if (groupListQuery.data) {
      const transformedData = transformGroupData(groupListQuery.data.groups);
      setNodes(transformedData);
    }
  }, [groupListQuery.data]);

  const GroupSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    metadata: Yup.object(),
    parent_id: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      metadata: {
        "": "",
      },
      parent_id: "",
    },
    validationSchema: GroupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        name: values.name,
        description: values.description,
        metadata: values.metadata,
        parent_id: values.parent_id,
        status: "enabled",
      };
      createGroup(data)
        .then(() => {
          toast.success("Asset Group created successfully");
          onCloseAddGroup();
          onGetGroupList();
        })
        .catch((error) => toast.error(error?.response?.data?.message || "Something went wrong"))
        .finally(() => setSubmitting(false));
    },
  });

  return (
    <>
      <div className="modal fade show d-block" id="kt_modal_add_group" role="dialog" tabIndex={-1} aria-modal="true">
        <div className="modal-dialog modal-dialog-centered mw-900px">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h2 className="fw-bolder">Add Asset Group</h2>

              <div className="btn btn-icon btn-sm btn-active-icon-primary" data-kt-group-modal-action="close" onClick={onCloseAddGroup} style={{ cursor: "pointer" }}>
                <KTIcon iconName="cross" className="fs-1" />
              </div>
            </div>

            <div className="modal-body mx-5 mx-xl-15 my-7">
              <form id="kt_modal_add_group_form" className="form" onSubmit={formik.handleSubmit} noValidate>
                <div className="d-flex flex-column me-n7 pe-7">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="required fw-bold fs-6 mb-2">Name</label>
                        <input
                          {...formik.getFieldProps("name")}
                          type="text"
                          name="name"
                          placeholder="Asset Group Name"
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
                        <label className="fw-bold fs-6 mb-2">Description</label>
                        <input
                          {...formik.getFieldProps("description")}
                          type="text"
                          name="description"
                          placeholder="Asset Group Description"
                          className="form-control mb-3 mb-lg-0"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Parent Name</label>
                        <TreeSelect
                          options={nodes}
                          value={selectedNodeKey}
                          onChange={(e) => {
                            const selectedValue = e.value ? String(e.value) : undefined;
                            setSelectedNodeKey(selectedValue);
                            formik.setFieldValue("parent_id", e.value);
                          }}
                          placeholder="Select Parent Group"
                          filter
                          filterPlaceholder="Search..."
                          className="form-control mb-3 mb-lg-0 d-flex p-0"
                          appendTo="self"
                          showClear={true}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="fv-row mb-6">
                        <label className="fw-bold fs-6 mb-2">Metadata</label>
                        <MetadataInputFields metadata={formik.values.metadata} setMetadata={(metadata: any) => formik.setFieldValue("metadata", metadata)} />
                        <label className="fs-6 text-muted">Enter asset group metadata in JSON format.</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddGroup} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formik.isSubmitting}>
                    <span className="indicator-label">Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { AddGroup };
