import clsx from "clsx";
import { useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import { Content } from "../../../_metronic/layout/components/content";
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from "../../../_metronic/layout/core";

const BuilderPage: React.FC = () => {
  const [tab, setTab] = useState("Sidebar");
  const [config, setConfig] = useState<ILayout>(getLayoutFromLocalStorage());
  const [configLoading, setConfigLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  const updateConfig = () => {
    setConfigLoading(true);
    try {
      LayoutSetup.setConfig(config);
      window.location.reload();
    } catch (error) {
      setConfig(getLayoutFromLocalStorage());
      setConfigLoading(false);
    }
  };

  const reset = () => {
    setResetLoading(true);
    setTimeout(() => {
      setConfig(getLayoutFromLocalStorage());
      setResetLoading(false);
    }, 1000);
  };

  return (
    <>
      <Content>
        <div className="card mb-10">
          <div className="card-body d-flex align-items-center py-8">
            <div className="d-flex h-80px w-80px flex-shrink-0 flex-center position-relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="text-primary h-75px w-75px h-lg-100px w-lg-100px position-absolute opacity-5">
                <path
                  fill="currentColor"
                  d="M10.2,21.23,4.91,18.17a3.58,3.58,0,0,1-1.8-3.11V8.94a3.58,3.58,0,0,1,1.8-3.11L10.2,2.77a3.62,3.62,0,0,1,3.6,0l5.29,3.06a3.58,3.58,0,0,1,1.8,3.11v6.12a3.58,3.58,0,0,1-1.8,3.11L13.8,21.23A3.62,3.62,0,0,1,10.2,21.23Z"
                ></path>
              </svg>
              <KTIcon iconName="wrench" className="fs-2x fs-lg-3x text-primary position-absolute" />
            </div>

            <div className="ms-6">
              <p className="list-unstyled text-gray-600 fw-bold fs-6 p-0 m-0">
                The layout builder is to assist your set and configure your preferred project layout specifications and preview it in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="card card-custom">
          <div className="card-header card-header-stretch overflow-auto">
            <ul
              className="nav nav-stretch nav-line-tabs
              fw-bold
              border-transparent
              flex-nowrap
            "
              role="tablist"
            >
              <li className="nav-item">
                <a className={clsx(`nav-link cursor-pointer`, { active: tab === "Sidebar" })} onClick={() => setTab("Sidebar")} role="tab">
                  Sidebar
                </a>
              </li>
              <li className="nav-item">
                <a className={clsx(`nav-link cursor-pointer`, { active: tab === "Header" })} onClick={() => setTab("Header")} role="tab">
                  Header
                </a>
              </li>
              <li className="nav-item">
                <a className={clsx(`nav-link cursor-pointer`, { active: tab === "Toolbar" })} onClick={() => setTab("Toolbar")} role="tab">
                  Toolbar
                </a>
              </li>
            </ul>
          </div>

          <form className="form">
            <div className="card-body">
              <div className="tab-content pt-3">
                <div className={clsx("tab-pane", { active: tab === "Sidebar" })}>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">Fixed sidebar mode</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="form-check form-check-custom form-check-solid form-switch
                      mb-2"
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.sidebar.default.fixed.desktop"
                            checked={config.app?.sidebar?.default?.fixed?.desktop}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.sidebar && con.app.sidebar.default && con.app.sidebar.default.fixed) {
                                con.app.sidebar.default.fixed.desktop = !con.app.sidebar.default.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="separator separator-dashed my-6"></div>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Minimize</h4>
                      <div className="fs-7 fw-semibold text-muted">Sidebar minimize mode</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="
                  form-check form-check-custom form-check-solid form-check-success form-switch
                    "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.sidebar.default.minimize.desktop.enabled"
                            id="kt_builder_sidebar_minimize_desktop_enabled"
                            checked={config.app?.sidebar?.default?.minimize?.desktop?.enabled}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.sidebar && con.app.sidebar.default && con.app.sidebar.default.minimize && con.app.sidebar.default.minimize.desktop) {
                                con.app.sidebar.default.minimize.desktop.enabled = !con.app.sidebar.default.minimize.desktop.enabled;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_enabled"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Minimize Toggle
                          </label>
                        </div>
                        <div
                          className="
                  form-check form-check-custom form-check-solid form-check-success form-switch ms-10
                    "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="kt_builder_sidebar_minimize_desktop_hoverable"
                            name="model.app.sidebar.default.minimize.desktop.hoverable"
                            checked={config.app?.sidebar?.default?.minimize?.desktop?.hoverable}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.sidebar && con.app.sidebar.default && con.app.sidebar.default.minimize && con.app.sidebar.default.minimize.desktop) {
                                con.app.sidebar.default.minimize.desktop.hoverable = !con.app.sidebar.default.minimize.desktop.hoverable;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_hoverable"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Hoverable
                          </label>
                        </div>
                        <div
                          className="
                  form-check form-check-custom form-check-solid form-check-success form-switch ms-10
                    "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="kt_builder_sidebar_minimize_desktop_default"
                            name="model.app.sidebar.default.minimize.desktop.default"
                            checked={config.app?.sidebar?.default?.minimize?.desktop?.default}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.sidebar && con.app.sidebar.default && con.app.sidebar.default.minimize && con.app.sidebar.default.minimize.desktop) {
                                con.app.sidebar.default.minimize.desktop.default = !con.app.sidebar.default.minimize.desktop.default;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label
                            className="form-check-label text-gray-700 fw-bold"
                            htmlFor="kt_builder_sidebar_minimize_desktop_default"
                            data-bs-toggle="tooltip"
                            data-kt-initialized="1"
                          >
                            Default Minimized
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={clsx("tab-pane", { active: tab === "Header" })}>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">Fixed header mode</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                        <div
                          className="
                      form-check form-check-custom form-check-solid form-switch
                      mb-2
                    "
                        >
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="model.app.header.default.fixed.desktop"
                            checked={config.app?.header?.default?.fixed?.desktop}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.header && con.app.header.default && con.app.header.default.fixed) {
                                con.app.header.default.fixed.desktop = !con.app.header.default.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                            // [(ngModel)]="model.app.header.default.fixed.desktop"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="separator separator-dashed my-6"></div>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Content</h4>
                      <div className="fs-7 fw-semibold text-muted">Header content type</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="form-check form-check-custom form-check-success form-check-solid form-check-sm ms-10">
                        <input
                          className="form-check-input"
                          type="radio"
                          checked={config.app?.header?.default?.content === "menu"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.header && con.app.header.default) {
                              con.app.header.default.content = "menu";
                              setConfig({ ...con });
                            }
                          }}
                          // [(ngModel)]="model.app.header.default.content}
                          value="menu"
                          id="kt_builder_header_content_menu"
                          name="model.app.header.default.content"
                        />
                        <label className="form-check-label text-gray-700 fw-bold text-nowrap" htmlFor="kt_builder_header_content_menu">
                          Menu
                        </label>
                      </div>
                      <div className="form-check form-check-custom form-check-success form-check-solid form-check-sm ms-10">
                        <input
                          className="form-check-input"
                          type="radio"
                          value="page-title"
                          id="kt_builder_header_content_page-title"
                          checked={config.app?.header?.default?.content === "page-title"}
                          onChange={() => {
                            const con = { ...config };
                            if (con.app && con.app.header && con.app.header.default) {
                              con.app.header.default.content = "page-title";
                              setConfig({ ...con });
                            }
                          }}
                        />
                        <label className="form-check-label text-gray-700 fw-bold text-nowrap" htmlFor="kt_builder_header_content_page-title">
                          Page Title
                        </label>
                      </div>
                    </div>
                  </div> */}
                </div>

                <div className={clsx("tab-pane", { active: tab === "Toolbar" })}>
                  <div className="form-group d-flex flex-stack">
                    <div className="d-flex flex-column">
                      <h4 className="fw-bold text-gray-900">Fixed</h4>
                      <div className="fs-7 fw-semibold text-muted">Fixed toolbar mode</div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <div className="d-flex justify-content-end">
                        <div className="form-check form-check-custom form-check-solid form-check-success form-switch me-10">
                          <input
                            className="form-check-input w-45px h-30px"
                            type="checkbox"
                            id="kt_builder_toolbar_fixed_desktop"
                            name="model.app.toolbar.fixed.desktop"
                            checked={config.app?.toolbar?.fixed?.desktop}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.toolbar && con.app.toolbar.fixed) {
                                con.app.toolbar.fixed.desktop = !con.app.toolbar.fixed.desktop;
                                setConfig({ ...con });
                              }
                            }}
                          />
                          <label className="form-check-label text-gray-700 fw-bold" htmlFor="kt_builder_toolbar_fixed_desktop">
                            Desktop Mode
                          </label>
                        </div>
                        <div className="form-check form-check-custom form-check-solid form-check-success form-switch">
                          <input
                            className="form-check-input w-45px h-30px"
                            type="checkbox"
                            name="model.app.toolbar.fixed.mobile"
                            checked={config.app?.toolbar?.fixed?.mobile}
                            onChange={() => {
                              const con = { ...config };
                              if (con.app && con.app.toolbar && con.app.toolbar.fixed) {
                                con.app.toolbar.fixed.mobile = !con.app.toolbar.fixed.mobile;
                                setConfig({ ...con });
                              }
                            }}
                            id="kt_builder_toolbar_fixed_mobile"
                          />
                          <label className="form-check-label text-gray-700 fw-bold" htmlFor="kt_builder_toolbar_fixed_mobile">
                            Mobile Mode
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer py-6">
                <div className="row">
                  <div className="col-lg-3"></div>
                  <div className="col-lg-9">
                    <button type="button" onClick={updateConfig} className="btn btn-primary me-2">
                      {!configLoading && <span className="indicator-label">Preview</span>}
                      {configLoading && (
                        <span className="indicator-progress d-block">
                          Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>

                    <button type="button" id="kt_layout_builder_reset" className="btn btn-active-light btn-color-muted" onClick={reset}>
                      {!resetLoading && <span className="indicator-label">Reset</span>}
                      {resetLoading && (
                        <span className="indicator-progress d-block">
                          Please wait... <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Content>
    </>
  );
};

export { BuilderPage };
