import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../services/api";

const FIELD_TYPES = [
  "text",
  "number",
  "textarea",
  "select",
  "checkbox",
  "radio",
  "amenities",
];










export default function AdminPropertyFormSettings() {
  const [config, setConfig] = useState(null);
  const [openPageIndex, setOpenPageIndex] = useState(null);
  const [openPages, setOpenPages] = useState({});



  useEffect(() => {
    api.get("/admin/form-config/property")
      .then(res =>
        setConfig(res)
        // console.log("checking", res)
      )
      .catch(err => console.error(err));
    if (config?.pages?.length) {
      setOpenPageIndex();
    }
  }
    , []);

  if (!config) return <AdminLayout>Loading…</AdminLayout>;

  /* =========================
     HELPERS
  ========================= */
  const updatePageTitle = (index, title) => {
    const pages = [...config.pages];
    pages[index].title = title;
    setConfig({ ...config, pages });
  };

  const addPage = () => {
    setConfig(prev => ({
      ...prev,
      pages: [
        ...prev.pages,
        {
          id: crypto.randomUUID(), // 🔒 permanent identity
          title: "New Page",
          fields: [],
        },
      ],
    }));
  };


  const addField = (pageIndex) => {
    const pages = [...config.pages];
    pages[pageIndex].fields.push({
      key: "",
      label: "",
      type: "text",
      visible: true,
      required: false,
      options: [],
    });
    setConfig({ ...config, pages });
  };

  const updateField = (pageIndex, fieldIndex, key, value) => {
    const pages = [...config.pages];
    pages[pageIndex].fields[fieldIndex][key] = value;
    setConfig({ ...config, pages });
  };

  const removeField = (pageIndex, fieldIndex) => {
    const pages = [...config.pages];
    pages[pageIndex].fields.splice(fieldIndex, 1);
    setConfig({ ...config, pages });
  };

  const addOption = (pageIndex, fieldIndex) => {
    const pages = [...config.pages];
    pages[pageIndex].fields[fieldIndex].options.push("");
    setConfig({ ...config, pages });
  };

  const updateOption = (pageIndex, fieldIndex, optionIndex, value) => {
    const pages = [...config.pages];
    pages[pageIndex].fields[fieldIndex].options[optionIndex] = value;
    setConfig({ ...config, pages });
  };

  const removeOption = (pageIndex, fieldIndex, optionIndex) => {
    const pages = [...config.pages];
    pages[pageIndex].fields[fieldIndex].options.splice(optionIndex, 1);
    setConfig({ ...config, pages });
  };

  const removePage = (pageIndex) => {
    if (!window.confirm("Delete this page?")) return;

    const pages = [...config.pages];
    pages.splice(pageIndex, 1);
    setConfig({ ...config, pages });
  };


  const save = async () => {
    await api.put("/admin/form-config/property", config);
    alert("Form configuration saved");
  };

  /* =========================
     UI
  ========================= */


  return (

    <AdminLayout>


      <div className="max-w-6xl mx-auto px-4 md:px-0">

        <h1 className="text-2xl font-semibold mb-6">
          Property Form Settings
        </h1>

        {/* PAGE CARDS */}
        <div className="space-y-5 md:space-y-6">

          {config.pages.map((page, pageIndex) => (

            <div
              key={page.id}
              className="bg-white dark:bg-black border dark:border-border rounded-xl p-5"
            >
              {/* PAGE HEADER */}
              {/* PAGE HEADER */}
              <div className="flex items-center justify-between mb-3">

                {/* LEFT: TITLE (TOGGLES ACCORDION) */}
                <button
                  type="button"
                  onClick={() =>
                    setOpenPageIndex(
                      openPageIndex === pageIndex ? null : pageIndex
                    )
                  }
                  className="flex items-center gap-2 text-left flex-1"
                >
                  <span
                    className={`transition-transform duration-300 ${openPageIndex === pageIndex ? "rotate-90" : ""
                      }`}
                  >
                    ▶
                  </span>

                  <input
                    value={page.title}
                    onClick={(e) => e.stopPropagation()} // 🔒 don't toggle while editing
                    onChange={(e) =>
                      updatePageTitle(pageIndex, e.target.value)
                    }
                    className="text-lg font-semibold bg-transparent border-b focus:outline-none"
                  />
                </button>

                {/* RIGHT: ACTIONS (DO NOT TOGGLE) */}
                <div
                  className="flex gap-3"
                  onClick={(e) => e.stopPropagation()} // 🔒 prevent accordion toggle
                >
                  <button
                    onClick={() => addField(pageIndex)}
                    className="text-sm px-3 py-1 border rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    + Add Field
                  </button>

                  <button
                    onClick={() => removePage(pageIndex)}
                    className="text-sm text-slate-400 hover:text-red-600 transition"
                  >
                    Delete Page
                  </button>
                </div>

              </div>




              {/* FIELD TABLE */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openPageIndex === pageIndex
                  ? "max-h-[3000px] opacity-100"
                  : "max-h-0 opacity-0"
                  }`}
              >
                <div className="pt-3 space-y-4">

                  {page.fields.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No fields added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {page.fields.map((field, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="rounded-xl p-4 md:p-5 space-y-4 bg-slate-50 dark:bg-neutral-900 shadow-sm"
                        >

                          {/* MAIN ROW */}
                          <div className="flex flex-col gap-4 md:grid md:grid-cols-12 md:gap-3 md:items-center">

                            <input
                              placeholder="Key"
                              value={field.key}
                              onChange={(e) =>
                                updateField(pageIndex, fieldIndex, "key", e.target.value)
                              }
                              className="md:col-span-3 input"
                            />

                            <input
                              placeholder="Label"
                              value={field.label}
                              onChange={(e) =>
                                updateField(pageIndex, fieldIndex, "label", e.target.value)
                              }
                              className="col-span-3 input"
                            />

                            <select
                              value={field.type}
                              onChange={(e) =>
                                updateField(pageIndex, fieldIndex, "type", e.target.value)
                              }
                              className="col-span-2 input"
                            >
                              {FIELD_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>

                            <label className="md:col-span-1 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <input
                                type="checkbox"
                                checked={field.required}
                                onChange={(e) =>
                                  updateField(pageIndex, fieldIndex, "required", e.target.checked)
                                }
                              />
                              Req
                            </label>

                            <label className="col-span-1 flex gap-2 text-xs items-center">
                              <input
                                type="checkbox"
                                checked={field.visible}
                                onChange={(e) =>
                                  updateField(pageIndex, fieldIndex, "visible", e.target.checked)
                                }
                              />
                              Show
                            </label>

                            <button
                              onClick={() => removeField(pageIndex, fieldIndex)}
                              className="md:col-span-2 text-sm text-slate-400 hover:text-red-600 transition"
                            >
                              Remove
                            </button>
                          </div>

                          {(field.type === "select" || field.type === "radio") && (
                            <div className="mt-3 rounded-lg bg-white dark:bg-black p-3 space-y-3">

                              <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  Select Options
                                </span>

                                <button
                                  onClick={() => addOption(pageIndex, fieldIndex)}
                                  className="text-xs px-3 py-1 dark:text-neutral-900 rounded-md bg-slate-100 hover:bg-slate-200 transition"
                                >
                                  + Add Option
                                </button>
                              </div>

                              {field.options.length === 0 && (
                                <p className="text-xs text-slate-400">
                                  No options added yet
                                </p>
                              )}

                              {field.options.map((opt, optIndex) => (
                                <div key={optIndex} className="flex gap-2">
                                  <input
                                    value={opt}
                                    placeholder={`Option ${optIndex + 1}`}
                                    onChange={(e) =>
                                      updateOption(
                                        pageIndex,
                                        fieldIndex,
                                        optIndex,
                                        e.target.value
                                      )
                                    }
                                    className="input flex-1"
                                  />
                                  <button
                                    onClick={() =>
                                      removeOption(pageIndex, fieldIndex, optIndex)
                                    }
                                    className="text-red-500 text-xs"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              </div>

            </div>
          ))}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={addPage}
            className="border px-4 py-2 rounded"
          >
            + Add Page
          </button>

          <button
            onClick={save}
            className="bg-emerald-600 text-white px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
