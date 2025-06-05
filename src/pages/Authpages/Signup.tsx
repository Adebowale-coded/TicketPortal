import { Link } from "react-router-dom";
import logo from "../../assets/imgs/logo.png"; // Make sure your logo is here

const Signup = () => {
    return (
        <div className="max-h-screen flex flex-col md:flex-row">
            {/* Left Column - Sign Up Form */}
            <div className="md:w-1/2 pt-[120px] lg:pt-0 w-full flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <img src={logo} alt="Logo" className="w-24 h-24 mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        Let’s get you started on your journey with us.
                    </p>

                    <form>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="text"
                            placeholder="Phone Number"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full border-2 border-black px-6 py-4 mt-6 text-black rounded-none text-sm sm:text-base hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 ease-in-out"
                        >
                            Create Account
                        </button>

                        <p className="text-center text-sm text-gray-600 mt-6">
                            Already have an account?{" "}
                            <Link to="/signin" className="text-blue-600 hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Column - Orange Background with Logo */}
            <div className="hidden md:flex w-1/2 h-[100vh] bg-orange-500 flex-col items-center justify-center text-white p-8">
                {/* <img src={logo} alt="Logo" className="w-24 h-24 mb-6" /> */}
                <div className="text-center max-w-sm">
                    <p className="text-lg italic">
                        "ALPHA DESK helps teams stay organized, track tasks, and get things done efficiently — all in one place."
                    </p>
                    <p className="mt-4 font-semibold">Powered by ALPHA DESK</p>
                    <p className="text-sm">Smart. Simple. Seamless.</p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
