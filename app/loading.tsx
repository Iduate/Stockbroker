export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A1929] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">Loading...</h1>
        <p className="text-xl text-blue-200/80 mb-8">
          Please wait while we set things up
        </p>
      </div>
    </div>
  );
} 