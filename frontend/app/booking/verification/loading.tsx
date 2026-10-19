export default function LoadingPage() {
  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-md mx-auto flex flex-col items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading verification page...</p>
      </div>
    </div>
  )
}

