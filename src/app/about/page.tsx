import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="min-h-screen p-4 flex flex-col items-center">
            <header className="w-full max-w-md flex justify-between items-center mb-8">
                <Link href="/profile" className="text-primary hover:underline">
                    &larr; Profile
                </Link>
                <h1 className="text-xl font-bold">About</h1>
            </header>

            <div className="w-full max-w-md prose prose-invert">
                <h3>How it works</h3>
                <p>
                    BaseStyle Lab is a client-side avatar generator. No images are uploaded to any server.
                    Everything happens in your browser using Canvas API.
                </p>

                <h3>Legal</h3>
                <p>
                    No blockchain interactions. This app only creates images and local metadata for sharing or later minting.
                </p>

                <p className="text-xs text-gray-500 mt-8">
                    Version 1.0.0
                </p>
            </div>
        </div>
    );
}
