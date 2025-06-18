import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/imgs/logo.png";

const Signin = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const BASE_URL = "https://reportpool.alphamorganbank.com:8443/api";
    const BasicAuth = { username: "alphadeskuser", password: "Qwerty1234" }; 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const basicAuth = 'Basic ' + btoa(`${BasicAuth.username}:${BasicAuth.password}`);

            const authRes = await fetch(`${BASE_URL}/user/auth?username=${credentials.username}&password=${credentials.password}`, {
                method: "POST",
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                }
            });

            const authData = await authRes;
            console.log("AUTH RESPONSE:", authData);

            if (!authData.ok || !authData) {
                setError("Invalid credentials. Please try again.");
                return;
            }

            const userRes = await fetch(`${BASE_URL}/user/${credentials.username}`, {
                method: "GET",
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json'
                }
            });
            const userData = await userRes.json();
            console.log("USER INFO:", userData);

            if (userData?.department?.toLowerCase().includes("it")) {
                localStorage.setItem('role', 'admin')
                localStorage.setItem('username', credentials.username)
                localStorage.setItem('dept', userData?.department)
                navigate("/admin");
            } else {
                localStorage.setItem('role', 'user')
                localStorage.setItem('username', credentials.username)
                localStorage.setItem('dept', userData?.department)
                navigate("/userdashboard");
            }

        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Please try again.");
        }
    };



    return (
        <div className="max-h-screen flex flex-col md:flex-row">
            {/* Left Column - Login Form */}
            <div className="md:w-1/2 pt-[120px] lg:pt-0 w-full flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <img src={logo} alt="Logo" className="w-24 h-24 mb-6" />
                    <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
                    <p className="text-sm text-gray-600 mt-2 mb-6">
                        Welcome back! Please enter your details.
                    </p>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm bg-red-100 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={credentials.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            className="w-full border-2 border-black px-6 py-4 mt-6 text-black rounded-none text-sm sm:text-base hover:bg-orange-500 hover:text-white hover:border-transparent transition-all duration-300 ease-in-out"
                        >
                            Sign in
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don’t have an account?{" "}
                        <span className="text-blue-600 hover:underline">Contact Admin</span>
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="hidden md:flex w-1/2 h-[100vh] bg-orange-500 flex-col items-center justify-center text-white p-8">
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

export default Signin;
