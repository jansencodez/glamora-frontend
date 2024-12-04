export default function NewsletterSignupSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-teal-500 via-teal-400 to-teal-500 text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold mb-4 tracking-tight">
          Stay Updated
        </h2>
        <p className="text-lg mb-8">
          Subscribe to our newsletter for exclusive offers and beauty tips!
        </p>

        {/* Signup Form */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-md text-gray-700 w-full max-w-md focus:ring-2 focus:ring-pink-400 outline-none transition-all"
          />
          <button className="bg-pink-500 hover:bg-pink-400 text-white px-6 py-3 rounded-md font-semibold transition-all shadow-md hover:shadow-lg">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
}
