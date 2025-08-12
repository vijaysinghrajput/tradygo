export function ProductCardSkeleton() {
  return (
    <div className="group relative animate-pulse">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
        <div className="h-full w-full bg-gray-300" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/2 rounded bg-gray-200" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}