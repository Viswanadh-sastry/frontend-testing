import clsx from "clsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { AddSensor } from "./AddSensor";
import { CreateView } from "./CreateView";

interface IWidgetDrawerProps {
  onGetChartWidget: (data: any) => void;
  onGetSensorWidget: (data: any) => void;
}

const WidgetDrawer = ({ onGetChartWidget, onGetSensorWidget }: IWidgetDrawerProps) => {
  const [isActivated, setIsActivated] = useState({
    chart: true,
    sensor: false,
    other: false,
  });
  const [isSelectChart, setIsSelectChart] = useState(false);
  const [isSelectSensor, setIsSelectSensor] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<any>(null);

  const onSelectWidget = (data: any) => {
    setSelectedLayout(data);
  };

  const onSelectSensor = (data: any) => {
    setSelectedLayout(data);
  };

  const onGetChartWidgetList = (data: any) => {
    onGetChartWidget(data);
  };

  const onGetSensorWidgetList = (data: any) => {
    onGetSensorWidget(data);
  };

  const onCloseAddChart = () => {
    setIsSelectChart(false);
  };

  const onCloseAddSensor = () => {
    setIsSelectSensor(false);
  };

  return (
    <>
      <div
        id="kt_widget"
        className="bg-body"
        data-kt-drawer="true"
        data-kt-drawer-name="widget"
        data-kt-drawer-activate="true"
        data-kt-drawer-overlay="true"
        data-kt-drawer-width="{default:'350px', 'md': '525px'}"
        data-kt-drawer-direction="end"
        data-kt-drawer-toggle="#kt_widget_toggle"
        data-kt-drawer-close="#kt_widget_close"
      >
        {/* begin::Card */}
        <div className="card shadow-none rounded-0">
          {/* begin::Header */}
          <div className="card-header" id="kt_widget_header">
            <h5 className="card-title fw-bold text-gray-600">Select widget</h5>

            <div className="card-toolbar">
              <button type="button" className="btn btn-sm btn-icon explore-btn-dismiss me-n5" id="kt_widget_close">
                <KTIcon iconName="cross" className="fs-2" />
              </button>
            </div>
          </div>
          {/* end::Header */}

          {/* begin::Body */}
          <div className="card-body position-relative" id="kt_widget_body">
            {/* begin::Content */}
            <div
              id="kt_widget_scroll"
              className="position-relative scroll-y me-n5"
              data-kt-scroll="true"
              data-kt-scroll-height="auto"
              data-kt-scroll-wrappers="#kt_widget_body"
              data-kt-scroll-dependencies="#kt_widget_header, #kt_widget_footer"
              data-kt-scroll-offset="5px"
            >
              {/* begin::Widget Size */}
              {/* <div className="form-group mb-7">
                <div className="d-flex flex-column mb-4">
                  <h4 className="fw-bold text-gray-900">Widget Size</h4>
                </div>
                <div className="d-flex justify-content-between gap-3">
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="Height" onChange={(e) => selectedLayout({ ...selectedLayout, height: e.target.value })} />
                    <div className="input-group-append">
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="Width" onChange={(e) => selectedLayout({ ...selectedLayout, width: e.target.value })} />
                    <div className="input-group-append">
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                </div>
              </div> */}
              {/* end::Widget Size */}

              {/* begin::Widget Position */}
              {/* <div className="form-group mb-7">
                <div className="d-flex flex-column mb-4">
                  <h4 className="fw-bold text-gray-900">Widget Position</h4>
                </div>
                <div className="d-flex justify-content-between gap-3">
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="Left" onChange={(e) => selectedLayout({ ...selectedLayout, left: e.target.value })} />
                    <div className="input-group-append">
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                  <div className="input-group">
                    <input type="number" className="form-control" placeholder="Top" onChange={(e) => selectedLayout({ ...selectedLayout, top: e.target.value })} />
                    <div className="input-group-append">
                      <span className="input-group-text">px</span>
                    </div>
                  </div>
                  <input type="number" className="form-control" placeholder="Order" onChange={(e) => selectedLayout({ ...selectedLayout, order: e.target.value })} />
                </div>
              </div> */}
              {/* end::Widget Position */}

              {/* begin::Widget Type */}
              <div className="form-group mb-7">
                <div className="d-flex flex-column mb-4">
                  <h4 className="fw-bold text-gray-900">Widget Type</h4>
                </div>

                <div className="d-flex flex-stack gap-3 " data-kt-buttons="true" data-kt-buttons-target=".form-check-image,.form-check-input" data-kt-initialized="1">
                  <label
                    className={`form-check-image form-check-success w-100 parent-active parent-hover ${isActivated.chart ? "active" : ""}`}
                    onClick={() => setIsActivated({ chart: true, sensor: false, other: false })}
                  >
                    <div className="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                      <i className="ki-duotone ki-chart fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      <span className="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">Chart</span>
                    </div>
                    {/* <div style={{ visibility: "hidden", height: 0, width: 0, overflow: "hidden" }}>
                      <input className="form-check-input" type="radio" value="duotone" checked name="layout-builder[layout][app][general][icons]" />
                    </div> */}
                  </label>
                  <label
                    className={`form-check-image form-check-success w-100 parent-active parent-hover ${isActivated.sensor ? "active" : ""}`}
                    onClick={() => setIsActivated({ chart: false, sensor: true, other: false })}
                  >
                    <div className="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                      <i className="ki-outline ki-tech-wifi fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700"></i>
                      <span className="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">Sensor</span>
                    </div>
                    {/* <div style={{ visibility: "hidden", height: 0, width: 0, overflow: "hidden" }}>
                      <input className="form-check-input" type="radio" value="outline" name="layout-builder[layout][app][general][icons]" />
                    </div> */}
                  </label>
                  <label
                    className={`form-check-image form-check-success w-100 parent-active parent-hover ${isActivated.other ? "active" : ""}`}
                    onClick={() => setIsActivated({ chart: false, sensor: false, other: true })}
                  >
                    <div className="form-check-wrapper d-flex flex-center border-gray-200 border-2 mb-0 py-3 px-4">
                      <i className="ki-solid ki-gear fs-1 text-gray-500 parent-active-gray-700 parent-hover-gray-700"></i>
                      <span className="fs-7 fw-semibold ms-2 text-gray-500 parent-active-gray-700 parent-hover-gray-700">Other</span>
                    </div>
                    {/* <div style={{ visibility: "hidden", height: 0, width: 0, overflow: "hidden" }}>
                      <input className="form-check-input" type="radio" value="solid" name="layout-builder[layout][app][general][icons]" />
                    </div> */}
                  </label>
                </div>
              </div>
              {/* end::Widget Type */}

              {/* begin::Widget */}
              {isActivated.chart && (
                <div className="form-group ">
                  <div className="d-flex flex-column mb-4">
                    <h4 className="fw-bold text-gray-900">Widget</h4>
                  </div>
                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "line",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/line.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "line"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "line", imageUrl: "media/widget/line.png" })}
                          />
                          <div className="form-check-label text-gray-800">Line</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "area",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/area.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "area"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "area", imageUrl: "media/widget/area.png" })}
                          />
                          <div className="form-check-label text-gray-800">Area</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "bar",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/bar.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "bar"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "bar", imageUrl: "media/widget/bar.png" })}
                          />
                          <div className="form-check-label text-gray-800">Bar</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "histogram",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/histogram.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "histogram"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "histogram", imageUrl: "media/widget/histogram.png" })}
                          />
                          <div className="form-check-label text-gray-800">Histogram</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "pie",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/pie.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "pie"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "pie", imageUrl: "media/widget/pie.png" })}
                          />
                          <div className="form-check-label text-gray-800">Pie</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "donut",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/donut.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "donut"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "donut", imageUrl: "media/widget/donut.png" })}
                          />
                          <div className="form-check-label text-gray-800">Donut</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "radialBar",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/radialbar.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "radialBar"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "radialBar", imageUrl: "media/widget/radialbar.png" })}
                          />
                          <div className="form-check-label text-gray-800">RadialBar</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "scatter",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/scatter.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "scatter"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "scatter", imageUrl: "media/widget/scatter.png" })}
                          />
                          <div className="form-check-label text-gray-800">Scatter</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "bubble",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/bubble.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "bubble"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "bubble", imageUrl: "media/widget/bubble.png" })}
                          />
                          <div className="form-check-label text-gray-800">Bubble</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "heatmap",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/heatmap.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "heatmap"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "heatmap", imageUrl: "media/widget/heatmap.png" })}
                          />
                          <div className="form-check-label text-gray-800">Heatmap</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "candlestick",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/candlestick.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "candlestick"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "candlestick", imageUrl: "media/widget/candlestick.png" })}
                          />
                          <div className="form-check-label text-gray-800">Candlestick</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "boxPlot",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/boxplot.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "boxPlot"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "boxPlot", imageUrl: "media/widget/boxplot.png" })}
                          />
                          <div className="form-check-label text-gray-800">BoxPlot</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "radar",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/radar.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "radar"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "radar", imageUrl: "media/widget/radar.png" })}
                          />
                          <div className="form-check-label text-gray-800">Radar</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "polarArea",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/polararea.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "polarArea"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "polarArea", imageUrl: "media/widget/polararea.png" })}
                          />
                          <div className="form-check-label text-gray-800">PolarArea</div>
                        </div>
                      </label>
                    </div>

                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "rangeBar",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/rangebar.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "rangeBar"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "rangeBar", imageUrl: "media/widget/rangebar.png" })}
                          />
                          <div className="form-check-label text-gray-800">RangeBar</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "treemap",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/treemap.png")} className="mw-100" alt="" style={{ width: "211px" }} />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "treemap"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "treemap", imageUrl: "media/widget/treemap.png" })}
                          />
                          <div className="form-check-label text-gray-800">Treemap</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* end::Widget */}

              {/* begin::Widget */}
              {isActivated.sensor && (
                <div className="form-group">
                  <div className="d-flex flex-column mb-4">
                    <h4 className="fw-bold text-gray-900">Widget</h4>
                  </div>
                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "SquareCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/SquareCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "SquareCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "SquareCard", imageUrl: "media/widget/SquareCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Square Card</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "RectangleCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/RectangleCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "RectangleCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "RectangleCard", imageUrl: "media/widget/RectangleCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Rectangle Card</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "LineCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/LineCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "LineCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "LineCard", imageUrl: "media/widget/LineCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Line Card</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "AnalogCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/AnalogCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "AnalogCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "AnalogCard", imageUrl: "media/widget/AnalogCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Analog Card</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "VerticalCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/VerticalCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "VerticalCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "VerticalCard", imageUrl: "media/widget/VerticalCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Vertical Card</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "HorizontalCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/HorizontalCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "HorizontalCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "HorizontalCard", imageUrl: "media/widget/HorizontalCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Horizontal Card</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "TableCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/TableCard.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "TableCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "TableCard", imageUrl: "media/widget/TableCard.png" })}
                          />
                          <div className="form-check-label text-gray-800">Table Card</div>
                        </div>
                      </label>
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "HorizontalLineCard",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/widget/ProgressLine.png")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "HorizontalLineCard"}
                            onChange={() => onSelectSensor({ ...selectedLayout, name: "HorizontalLineCard", imageUrl: "media/widget/ProgressLine.png" })}
                          />
                          <div className="form-check-label text-gray-800">Horizontal Line Card</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* end::Widget */}

              {/* begin::Widget */}
              {isActivated.other && (
                <div className="form-group">
                  <div className="d-flex flex-column mb-4">
                    <h4 className="fw-bold text-gray-900">Widget</h4>
                  </div>
                  <div className="overflow-auto pb-5">
                    <div className="d-flex flex-row">
                      <label
                        className={clsx("form-check-image form-check-success p-2", {
                          active: selectedLayout?.name === "other",
                        })}
                      >
                        <div className="form-check-wrapper">
                          <img src={toAbsoluteUrl("media/stock/600x400/img-33.jpg")} className="mw-100" alt="" />
                        </div>
                        <div className="form-check form-check-custom form-check-success form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="radio"
                            value="saas"
                            name="model.app.toolbar.layout"
                            checked={selectedLayout?.name === "other"}
                            onChange={() => onSelectWidget({ ...selectedLayout, name: "other", imageUrl: "media/stock/600x400/img-33.jpg" })}
                          />
                          <div className="form-check-label text-gray-800">Other</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {/* end::Widget */}
            </div>
            {/* end::Content */}
          </div>
          {/* end::Body */}
          <div className="card-footer py-5 text-center" id="kt_widget_footer">
            {isActivated.chart ? (
              <Link to="#" className={`btn btn-primary w-100 ${!selectedLayout && "disabled"}`} onClick={() => setIsSelectChart(true)}>
                Continue
              </Link>
            ) : (
              <Link to="#" className={`btn btn-primary w-100 ${!selectedLayout && "disabled"}`} onClick={() => setIsSelectSensor(true)}>
                Continue
              </Link>
            )}
          </div>
        </div>
        {/* end::Card */}
      </div>
      {isSelectChart && <CreateView selectedLayout={selectedLayout} onCloseAddChart={onCloseAddChart} onGetChartWidgetList={(data) => onGetChartWidgetList(data)} />}
      {isSelectSensor && <AddSensor selectedLayout={selectedLayout} onCloseAddSensor={onCloseAddSensor} onGetSensorWidgetList={(data) => onGetSensorWidgetList(data)} />}
    </>
  );
};

export { WidgetDrawer };
