import Link from "next/link";
import Image from "next/image";
export default function NotFound() {
  return (
    <div className="min-h-[70vh] grid place-items-center text-center px-4">
      <div>
        <Image
          src="/404-studio.jpg"
          alt="not found"
          width={200}
          height={200}
          className="mx-auto"
        />  
        <p className="text-xl mt-2">The page you are looking for does not exist.</p>
        <Link href="/" className="btn btn-primary mt-6">Return to Home</Link>
      </div>
    </div>
  );
}