import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Brand & Copyright */}
        <p className="text-sm md:text-base text-center md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Glamora Beauty</span>. All rights
          reserved.
        </p>

        {/* Navigation Links */}
        <div className="mt-4 md:mt-0">
          <Link
            href="/"
            className="text-white hover:text-blue-200 transition-colors px-3"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-white hover:text-blue-200 transition-colors px-3"
          >
            Products
          </Link>
          <Link
            href="/admin/login"
            className="text-white font-semibold hover:text-red-300 transition-colors px-3"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
