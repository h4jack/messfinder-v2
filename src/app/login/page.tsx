import Link from "next/link";
// pages/login.tsx
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mt-3">Welcome Back</h1>
          <p className="text-gray-600">Login to find your perfect mess</p>
        </div>

        <form className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-5 border border-teal-100">
          <input type="email" placeholder="Email" className="w-full..." />
          <input type="password" placeholder="Password" className="w-full..." />
          
          <button className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700">
            Login
          </button>

          <div className="flex items-center gap-2">
            <hr className="flex-1" />
            <span className="text-sm text-gray-500">or</span>
            <hr className="flex-1" />
          </div>

          <button className="w-full border border-teal-200 text-teal-700 py-3 rounded-xl font-medium hover:bg-teal-50">
            Continue with Google
          </button>

          <p className="text-center text-sm">
            Don't have an account? <Link href="/register" className="text-teal-600 font-medium">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
}