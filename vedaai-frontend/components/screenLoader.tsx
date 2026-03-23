"use client";

type Props = {
  show: boolean;
  text?: string;
};

export default function FullScreenLoader({
  show,
  text = "Loading... Please wait",
}: Props) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
      bg-black/30 backdrop-blur-sm">

      <div className="bg-white rounded-2xl px-6 py-5 shadow-lg text-center">
        
        {/* Spinner */}
        <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4" />

        {/* Text */}
        <p className="text-sm text-gray-700 font-medium">
          {text}
        </p>
      </div>
    </div>
  );
}