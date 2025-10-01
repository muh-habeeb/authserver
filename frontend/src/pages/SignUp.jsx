/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import Input from "../components/input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/AuthStore.js";
import toast from "react-hot-toast";
const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { signup, error, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // generic change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password || !formData.name) {
        console.log("a;;")
        throw new Error("All fields are required")

      }
      await signup(formData.email, formData.password, formData.name);
      // redirect to verify email page after successful signup
      toast.success("registration successfull")
      navigate("/verify-email");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.log("errorroor:", error?.response?.data?.message || error.message);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50  backdrop-filter backdrop-blur-xl rounded-2xl shadow-gray-800 shadow-xl  overflow-hidden"
    >

      <div className="p-8">
        <h2 className=" capitalize text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to bg-emerald-500 text-transparent bg-clip-text">
          Create account
        </h2>
        <form onSubmit={handleSignUp}>
          {[
            {
              name: "name",
              type: "text",
              placeholder: "Full Name",
              icon: User,
            },
            {
              name: "email",
              type: "email",
              placeholder: "Email address",
              icon: Mail,
            },
            {
              name: "password",
              type: "password",
              placeholder: "Password",
              icon: Lock,
            },
          ].map(({ name, type, placeholder, icon }) => (
            <Input
              key={name}
              icon={icon}
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]} // 🔑 dynamic lookup
              onChange={handleInputChange}
              autoComplete="off"
              autoCorrect="off"
            />
          ))}

          {error && <p className="text-red-500 font-semibold mt-2 capitalize">{error}</p>}
          <PasswordStrengthMeter password={formData.password} />
          <motion.button
            className=" cursor-pointer mt-5 w-full py-3 bg-gradient-to-r from-green-500 to bg-emerald-600 text-white font-bold rounded-lg shadow-lg  hover:from-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader size={24} className="animate-spin mx-auto" /> : "Sign Up"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center ">
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to={"/signin"}
            className="text-green-400 hover:underline hover:transition hover:duration-300"
          >
            Log In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUp;
