import { useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { TreeSelect } from "primereact/treeselect";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getGroupListAll } from "../../../../groups/api/GroupAPI";
import { createChannelGroup } from "../../../api/ChannelGroupAPI";

interface IAddGroupProps {
  onCloseAddGroup: () => void;
  onGetGroupList: () => void;
}

const AddGroup = ({ onCloseAddGroup, onGetGroupList }: IAddGroupProps) => {
  const [nodes, setNodes] = useState<[]>([]);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | undefined>(undefined);
  const params = useParams();
  const id = params.id as string;

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
    group_ids: Yup.string().required("Asset group is required"),
  });

  const formik = useFormik({
    initialValues: {
      group_ids: "",
    },
    validationSchema: GroupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const data = {
        group_ids: [values.group_ids],
      };
      createChannelGroup(id, data)
        .then(() => {
          toast.success("Asset Group assigned successfully");
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
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered mw-900px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              {/* begin::Modal title */}
              <h2 className="fw-bolder">Add Asset Group</h2>
              {/* end::Modal title */}

              {/* begin::Close */}
              <div className="btn btn-icon btn-sm btn-active-icon-primary cursor-pointer" data-kt-group-modal-action="close" onClick={onCloseAddGroup}>
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
                        <label className="fw-bold fs-6 mb-2">Parent Name</label>
                        <TreeSelect
                          options={nodes}
                          value={selectedNodeKey}
                          onChange={(e) => {
                            const selectedValue = e.value ? String(e.value) : undefined;
                            setSelectedNodeKey(selectedValue);
                            formik.setFieldValue("group_ids", e.value);
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
                </div>

                {/* begin::Actions */}
                <div className="text-center pt-15">
                  <button type="reset" onClick={onCloseAddGroup} className="btn btn-light me-3" data-kt-group-modal-action="cancel" disabled={formik.isSubmitting}>
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

export { AddGroup };
