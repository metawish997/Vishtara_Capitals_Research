import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Login() {
   const navigate = useNavigate();
   const { login, register } = useAuth();
   const [loading, setLoading] = useState(false);

   // 'login' | 'register' | 'registerOtp' | 'forgotPassword' | 'resetPassword'
   const [viewMode, setViewMode] = useState('login');

   const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      agree: false,
      otp: "",
      newPassword: "",
      identifier: "", // for forgot password
      type: "email" // for forgot password
   });

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value
      }));
   };

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const response = await login({ email: formData.email, password: formData.password });
         toast.success("Logged in successfully!");

         if (response?.user?.role === 'admin' || response?.user?.role === 'superadmin' || response?.user?.role === 'super admin') {
            navigate("/admin/dashboard");
         } else {
            navigate("/portal");
         }
      } catch (error) {
         toast.error(error?.response?.data?.message || "Authentication failed. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const handleSendRegisterOtp = async (e) => {
      e.preventDefault();
      if (!formData.agree) {
         toast.error("Please agree to the Terms & Privacy Policy");
         return;
      }
      setLoading(true);
      try {
         const res = await api.post('/auth/send-otp', {
            email: formData.email,
            phone: formData.phone
         });
         if (res.data.success) {
            toast.success(res.data.message || "OTP sent successfully!");
            setViewMode('registerOtp');
         }
      } catch (error) {
         toast.error(error?.response?.data?.message || "Failed to send OTP.");
      } finally {
         setLoading(false);
      }
   };

   const handleRegister = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await register({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            otp: formData.otp,
            annual_income: "0-1L", // default behind the scenes
            is_age_verified: true   // default behind the scenes
         });

         if (res.success) {
            toast.success("Account created successfully!");

            // clear passwords
            setFormData(prev => ({ ...prev, password: '', otp: '' }));

            // Auto login logic: check if user is returned and redirect
            if (res.user) {
               if (res.user.role === 'admin' || res.user.role === 'superadmin' || res.user.role === 'super admin') {
                  navigate("/admin/dashboard");
               } else {
                  navigate("/portal");
               }
            } else {
               setViewMode('login');
            }
         }
      } catch (error) {
         toast.error(error?.response?.data?.message || "Registration failed.");
      } finally {
         setLoading(false);
      }
   };

   const handleSendForgotOtp = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const type = formData.identifier.includes('@') ? 'email' : 'phone';
         const res = await api.post('/auth/forgot-password', {
            identifier: formData.identifier,
            type: type
         });
         if (res.data.success) {
            toast.success(res.data.message || "OTP sent successfully!");
            setFormData(prev => ({ ...prev, type: type }));
            setViewMode('resetPassword');
         }
      } catch (error) {
         toast.error(error?.response?.data?.message || "Failed to send reset OTP.");
      } finally {
         setLoading(false);
      }
   };

   const handleResetPassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const res = await api.post('/auth/reset-password', {
            identifier: formData.identifier,
            otp: formData.otp,
            newPassword: formData.newPassword,
            type: formData.type
         });
         if (res.data.success) {
            toast.success("Password reset successfully! Please login.");
            setViewMode('login');
            setFormData(prev => ({ ...prev, password: '', newPassword: '', otp: '' }));
         }
      } catch (error) {
         toast.error(error?.response?.data?.message || "Failed to reset password.");
      } finally {
         setLoading(false);
      }
   };

   const inputStyle = { width: "100%", padding: "25px 20px", borderRadius: "6px", border: "1px solid #D9E1EA", outline: "none", fontSize: "15px", backgroundColor: "#F0F4F8" };
   const labelStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#1B2B40", marginBottom: "8px" };
   const btnStyle = { padding: "18px", fontSize: "15px", backgroundColor: "#F8B919", borderColor: "#F8B919", color: "#1B2B40", fontWeight: "700", opacity: loading ? 0.7 : 1 };

   return (
      <main>
         <style>{`
            body.high-contrast .login-page-bg {
               background-color: #0d131c !important;
            }
            body.high-contrast .login-page-card {
               background-color: #1A2735 !important;
               border-color: rgba(255, 255, 255, 0.1) !important;
            }
            body.high-contrast .login-page-card h3,
            body.high-contrast .login-page-card label,
            body.high-contrast .login-page-card p,
            body.high-contrast .login-page-card span,
            body.high-contrast .login-page-card a,
            body.high-contrast .login-page-card button:not(.tp-btn) {
               color: #ffffff !important;
            }
            body.high-contrast .login-page-card input {
               background-color: #121A24 !important;
               border-color: rgba(255,255,255,0.2) !important;
               color: #ffffff !important;
            }
            body.high-contrast .login-page-card input::placeholder {
               color: #A0ABBB !important;
            }
         `}</style>
         <div className="tp-contact-ptb tp-sec-ptb upt-180 upb-120 login-page-bg" style={{ backgroundColor: "#f8fafc" }}>
            <div className="container">
               <div className="row justify-content-center">
                  <div className="col-lg-6 col-md-10">
                     <div className="login-page-card" style={{ padding: "40px", borderRadius: "10px", border: "1px solid var(--card-border, #D9E1EA)", background: "#ffffff", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>

                        <div className="text-center umb-40">
                           <img src="/vistaralogo.svg" alt="Vishtara Logo" style={{ width: "60px", marginBottom: "15px" }} />
                           <h3 style={{ color: "var(--primary)", fontSize: "28px" }}>
                              {viewMode === 'login' && "Welcome Back"}
                              {(viewMode === 'register' || viewMode === 'registerOtp') && "Create Account"}
                              {(viewMode === 'forgotPassword' || viewMode === 'resetPassword') && "Reset Password"}
                           </h3>
                           <p style={{ fontSize: "14px", color: "#4A5568", fontWeight: "500" }}>
                              {viewMode === 'login' && "Enter your email and password to log in"}
                              {(viewMode === 'register' || viewMode === 'registerOtp') && "Register to access your portfolio portal"}
                              {viewMode === 'forgotPassword' && "Enter your email or phone to receive an OTP"}
                              {viewMode === 'resetPassword' && "Enter the OTP and your new password"}
                           </p>
                        </div>

                        {viewMode === 'login' && (
                           <form onSubmit={handleLogin}>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Email or Phone Number</label>
                                 <input type="text" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email or phone" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px" }}>
                                 <div className="d-flex justify-content-between">
                                    <label style={labelStyle}>Password</label>
                                    <a href="#" onClick={(e) => { e.preventDefault(); setViewMode('forgotPassword'); }} style={{ fontSize: "13px", color: "#1B2B40", fontWeight: "600" }}>Forgot password?</a>
                                 </div>
                                 <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
                              </div>
                              <button type="submit" className="tp-btn w-100" disabled={loading} style={btnStyle}>
                                 {loading ? "Processing..." : "Sign In"}
                              </button>
                           </form>
                        )}

                        {viewMode === 'register' && (
                           <form onSubmit={handleSendRegisterOtp}>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Full Name</label>
                                 <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Email Address</label>
                                 <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="name@example.com" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Phone Number</label>
                                 <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter phone number" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Password</label>
                                 <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                 <input type="checkbox" name="agree" id="agree" checked={formData.agree} onChange={handleChange} required style={{ marginTop: "4px" }} />
                                 <label htmlFor="agree" style={{ fontSize: "13px", color: "#4A5568", fontWeight: "500", lineHeight: "1.5" }}>
                                    I agree to the <Link to="/terms-and-conditions" style={{ color: "var(--primary)", fontWeight: "600" }}>Terms &amp; Services</Link> and <Link to="/privacy-policy" style={{ color: "var(--primary)", fontWeight: "600" }}>Privacy Policy</Link>.
                                 </label>
                              </div>
                              <button type="submit" className="tp-btn w-100" disabled={loading} style={btnStyle}>
                                 {loading ? "Sending OTP..." : "Continue"}
                              </button>
                           </form>
                        )}

                        {viewMode === 'registerOtp' && (
                           <form onSubmit={handleRegister}>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Enter OTP</label>
                                 <input type="text" name="otp" value={formData.otp} onChange={handleChange} required placeholder="6-digit OTP" style={inputStyle} />
                              </div>
                              <button type="submit" className="tp-btn w-100" disabled={loading} style={btnStyle}>
                                 {loading ? "Verifying..." : "Verify & Create Account"}
                              </button>
                              <div className="text-center mt-3">
                                 <button type="button" onClick={() => setViewMode('register')} style={{ border: "none", background: "none", color: "var(--primary)", fontSize: "14px", fontWeight: "600" }}>
                                    Back to details
                                 </button>
                              </div>
                           </form>
                        )}

                        {viewMode === 'forgotPassword' && (
                           <form onSubmit={handleSendForgotOtp}>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Email or Phone Number</label>
                                 <input type="text" name="identifier" value={formData.identifier} onChange={handleChange} required placeholder="Enter registered email or phone" style={inputStyle} />
                              </div>
                              <button type="submit" className="tp-btn w-100" disabled={loading} style={btnStyle}>
                                 {loading ? "Sending OTP..." : "Send Reset OTP"}
                              </button>
                           </form>
                        )}

                        {viewMode === 'resetPassword' && (
                           <form onSubmit={handleResetPassword}>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>Enter OTP</label>
                                 <input type="text" name="otp" value={formData.otp} onChange={handleChange} required placeholder="6-digit OTP" style={inputStyle} />
                              </div>
                              <div style={{ marginBottom: "20px" }}>
                                 <label style={labelStyle}>New Password</label>
                                 <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required placeholder="••••••••" style={inputStyle} />
                              </div>
                              <button type="submit" className="tp-btn w-100" disabled={loading} style={btnStyle}>
                                 {loading ? "Updating..." : "Reset Password"}
                              </button>
                           </form>
                        )}

                        {/* Footer Toggles */}
                        {(viewMode === 'login' || viewMode === 'register' || viewMode === 'forgotPassword') && (
                           <div className="text-center umt-30" style={{ fontSize: "14px" }}>
                              <span style={{ color: "#4A5568", fontWeight: "500" }}>
                                 {viewMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                              </span>{" "}
                              <button
                                 onClick={() => setViewMode(viewMode === 'login' ? 'register' : 'login')}
                                 style={{ border: "none", background: "none", color: "var(--primary)", fontWeight: "700", cursor: "pointer" }}
                              >
                                 {viewMode === 'login' ? "Register Now" : "Sign In"}
                              </button>
                           </div>
                        )}

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}
