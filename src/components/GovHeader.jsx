export default function GovHeader() {
  return (
    <div className="flex items-center gap-4 bg-white border-b px-6 py-3">
      <img src="/images/tn-logo.png" alt="Tamil Nadu Logo" className="w-12 h-12" />
      <div className="leading-tight">
        <h1 className="text-base font-bold text-green-800">
          தமிழ்நாடு அரசு | Government of Tamil Nadu
        </h1>
        <p className="text-sm text-gray-700 tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>
          <span className="block text-[14px] mb-0.5">
            வருவாய் நிருவாகம் மற்றும் பேரிடர் மேலாண்மை ஆணையகம்
          </span>
          <span className="block text-[14px] mb-0.5">
            Commissionerate of Revenue Administration and Disaster Management
          </span>
        </p>
      </div>
    </div>
  );
}
