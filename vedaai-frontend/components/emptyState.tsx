import Image from "next/image";
import { useRouter } from "next/navigation";

export default function EmptyState() {

  const router = useRouter()
    return (
      <div className="text-center max-w-md mx-auto mt-8 md:mt-24">
        
        {/* Illustration */}
        <div className="mb-6">
          <div className="w-[50%] rounded-full mx-auto flex items-center justify-center text-4xl">
            <Image src={"emptyIllus.svg"} width={200} height={200} alt="empty"/>
          </div>
        </div>
  
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          No assignments yet
        </h2>
  
        {/* Description */}
        <p className="text-gray-500 text-sm mb-6">
        Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
        </p>
  
        {/* CTA */}
        <button onClick={()=>router.push("/assignments/create")} className="bg-[#303030] cursor-pointer text-white px-6 py-3 rounded-full">
          + Create Your First Assignment
        </button>
      </div>
    );
  }