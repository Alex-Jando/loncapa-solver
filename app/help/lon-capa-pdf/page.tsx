import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Get LON-CAPA PDF",
  description: "Instructions for obtaining a LON-CAPA PDF for use in NO-CAPA.",
  alternates: {
    canonical: "/help/lon-capa-pdf",
  },
};

export default function LonCapaPdfHelpPage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12 text-slate-900">
      <h1 className="text-2xl font-semibold">How to Download Your LON-CAPA PDF</h1>
      <p className="mt-3 text-sm text-slate-600">
        Use these steps to export your assignment PDF and upload it into NO-CAPA.
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-700">
          Start here:{" "}
          <a
            href="https://loncapa.mcmaster.ca/adm/navmaps"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-indigo-600 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-700"
          >
            https://loncapa.mcmaster.ca/adm/navmaps
          </a>
        </p>
      </div>

      <ol className="mt-8 space-y-6">
        <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Step 1: Open your assignment list</h2>
          <p className="mt-2 text-sm text-slate-600">
            Log into LON-CAPA and navigate to your assignment page.
          </p>
          <img
            src="/images/HowToGetPDF/Step1.png"
            alt="Step 1 screenshot of the LON-CAPA assignment page."
            className="mt-4 w-full rounded-xl border border-slate-200"
          />
        </li>

        <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Step 2: Open the print option</h2>
          <p className="mt-2 text-sm text-slate-600">
            Select the option that lets you print the assignment view.
          </p>
          <img
            src="/images/HowToGetPDF/Step2.png"
            alt="Step 2 screenshot showing the print/export option."
            className="mt-4 w-full rounded-xl border border-slate-200"
          />
        </li>

        <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Step 3: Select the settings</h2>
          <p className="mt-2 text-sm text-slate-600">
            Choose all the correct settings and click <span className="font-medium">Next</span>.
          </p>
          <img
            src="/images/HowToGetPDF/Step3.png"
            alt="Step 3 screenshot of Save as PDF selected."
            className="mt-4 w-full rounded-xl border border-slate-200"
          />
        </li>

        <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Step 4: Save and upload to NO-CAPA</h2>
          <p className="mt-2 text-sm text-slate-600">
            Save the file to your computer, then return to NO-CAPA and upload it in the PDF area.
          </p>
          <img
            src="/images/HowToGetPDF/Step4.png"
            alt="Step 4 screenshot of final save step."
            className="mt-4 w-full rounded-xl border border-slate-200"
          />
        </li>
      </ol>
    </main>
  );
}
