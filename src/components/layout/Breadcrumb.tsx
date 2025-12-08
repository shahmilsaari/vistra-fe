import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-neutral-300 dark:text-neutral-600">/</span>}
          {item.href ? (
            <Link href={item.href} className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-900 dark:text-white font-medium truncate max-w-[200px]">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
