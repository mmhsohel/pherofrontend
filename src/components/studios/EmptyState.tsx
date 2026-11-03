import Link from "next/link";
import { PackageOpen } from "lucide-react";
export default function EmptyState({ title, text, cta, href }: { title: string; text: string; cta: string; href: string }) {
  return (
    <div className="text-center py-20 border-2 border-dashed border-base-300 rounded-box">
      <PackageOpen className="mx-auto text-primary" size={56} />
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-base-content/70 mt-1">{text}</p>
      <Link href={href} className="btn btn-primary mt-5">{cta}</Link>
    </div>
  );
}