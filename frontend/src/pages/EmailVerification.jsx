import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js";
import toast from "react-hot-toast";

const EmailVerification = () => {
	const [code, setCode] = useState(Array(6).fill("")); /// Array to hold 6 digits
	const inputRefs = useRef([]);
	const navigate = useNavigate();
	const [canResend, setCanResend] = useState(true);
	const [resendCountdown, setResendCountdown] = useState(0);
	const [isResending, setIsResending] = useState(false);

	const { error, isLoading, verifyEmail, isAuthenticated, user, resendVerificationEmail } = useAuthStore();

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/signin");
		}
		if (isAuthenticated && user?.isVerified) {
			navigate("/")
		}
	}, [isAuthenticated, navigate, user?.isVerified]);

	// Timer effect for resend countdown
	useEffect(() => {
		let timer;
		if (resendCountdown > 0) {
			timer = setInterval(() => {
				setResendCountdown(prev => {
					if (prev <= 1) {
						setCanResend(true);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => clearInterval(timer);
	}, [resendCountdown]);

	const handleChange = (index, value) => {
		if (!/^\d*$/.test(value)) return; // Only allow digits
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);
			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = useCallback(async (e) => {
		e.preventDefault();
		if (code.some((digit) => !digit)) {
			toast.error("Please enter the complete 6-digit code");
			return;
		}
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			toast.success("Email verified successfully");
			navigate("/");
		} catch (error) {
			toast.error(error?.response?.data?.message || error.message);
			console.log("errorroor:", error);
		}
	}, [code, verifyEmail, navigate]);

	const handleResendEmail = async () => {
		if (!canResend || isResending) return;

		setIsResending(true);
		try {
			await resendVerificationEmail();
			toast.success("Verification email sent successfully!");
			setCanResend(false);
			setResendCountdown(120); // 2 minutes = 120 seconds
		} catch (error) {
			toast.error(error?.response?.data?.message || "Failed to resend email");
			console.log("Resend error:", error);
		} finally {
			setIsResending(false);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code, handleSubmit]);

	// Format countdown timer display
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	return (
		<div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
			<motion.div
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md'
			>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Verify Your Email
				</h2>
				<p className='text-center text-gray-300 mb-6'>Enter the 6-digit code sent to your email address.</p>
				{error && <p className='text-red-500 font-semibold mb-2 capitalize'>{error}</p>}

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								maxLength='6'
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
							/>
						))}
					</div>
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</motion.button>
				</form>

				{/* Resend Email Section */}
				<div className="mt-6 text-center">
					<p className="text-gray-400 text-sm mb-3">
						Didn't receive the code?
					</p>

					{canResend ? (
						<motion.button
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleResendEmail}
							disabled={isResending}
							className="text-green-400 hover:text-green-300 font-semibold text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isResending ? "Sending..." : "Resend Email"}
						</motion.button>
					) : (
						<div className="text-gray-500 text-sm">
							<p>Resend available in</p>
							<p className="font-mono text-green-400 text-lg font-bold">
								{formatTime(resendCountdown)}
							</p>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};

export default EmailVerification;