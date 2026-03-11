"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function SchoolRegistrationPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [schoolName, setSchoolName] = useState("");
    const [grade, setGrade] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const isCouponValid = couponCode.trim().toUpperCase() === "MAX26";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isCouponValid) {
            // No coupon -> go to cashfree
            window.location.href = "https://payments.cashfree.com/forms/schooljdw";
            return;
        }

        if (!invoiceFile) {
            setError("Please upload an invoice file to apply the coupon.");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("customerName", name);
            formData.append("customerEmail", email);
            formData.append("customerPhone", phone);
            formData.append("couponCode", couponCode.trim().toUpperCase());
            formData.append("customFields", JSON.stringify({
                SchoolName: schoolName,
                Grade: grade
            }));
            formData.append("invoice", invoiceFile);

            const res = await fetch(`${API_BASE}/payments/school-registration`, {
                method: "POST",
                body: formData, // the browser will automatically set the mixed content-type boundaries
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to submit registration");
            }
        } catch (err) {
            console.error(err);
            setError("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 p-6">
                <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md text-center">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ✓
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Registration Complete</h2>
                    <p className="text-slate-600 mb-8">
                        Thank you for registering for Jaipur Design Week! Your invoice has been submitted and your School Access Pass has been generated.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition"
                    >
                        Register Another Student
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-slate-50 flex items-center justify-center py-12 px-4" style={{ fontFamily: "var(--font-geist-sans)" }}>

            {/* Background elements (borrowed from login page for consistency) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-15%] right-[10%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-pink-200/50 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-xl bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
                {/* Gradient header line */}
                <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-r from-emerald-400 to-indigo-500"></div>

                <div className="p-8 md:p-10">
                    <div className="flex flex-col items-center text-center mb-8">
                        <img src="/logo.png" alt="Jaipur Design Week" className="h-16 mb-6 drop-shadow-sm" />
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">School Student Registration</h1>
                        <p className="text-slate-500 font-medium">Register for the JDW School Studio Pass</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <input
                                    type="text" required value={name} onChange={e => setName(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                                    placeholder="Student Name"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <input
                                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                                    placeholder="student@school.edu"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <input
                                    type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                                    placeholder="+91"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Grade / Class</label>
                                <input
                                    type="text" required value={grade} onChange={e => setGrade(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                                    placeholder="e.g. 11th Grade"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">School Name</label>
                            <input
                                type="text" required value={schoolName} onChange={e => setSchoolName(e.target.value)}
                                className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition shadow-sm"
                                placeholder="Full name of your school"
                            />
                        </div>

                        <div className="bg-slate-100/50 p-5 rounded-2xl border border-slate-200 mt-2">
                            <div className="flex flex-col gap-2 mb-4">
                                <label className="text-sm font-bold text-slate-700 ml-1">Coupon Code (Optional)</label>
                                <input
                                    type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)}
                                    className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition uppercase font-bold shadow-sm"
                                    placeholder="Enter Code"
                                />
                            </div>

                            {/* Show file upload ONLY if coupon is explicitly MAX26 */}
                            <div className={`transition-all duration-500 overflow-hidden ${isCouponValid ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-emerald-700 ml-1">Upload Required Invoice</label>
                                    <p className="text-xs text-slate-500 ml-1 mb-1">Since you used coupon <strong>MAX26</strong>, please upload your invoice.</p>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        required={isCouponValid}
                                        onChange={e => setInvoiceFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-4 w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg text-lg flex justify-center items-center gap-2
                                ${loading ? 'bg-indigo-400 cursor-not-allowed' : (
                                    isCouponValid
                                        ? 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-500/30'
                                        : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-500/30'
                                )} hover:-translate-y-0.5`}
                        >
                            {loading && <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>}
                            {isCouponValid ? "Submit Registration" : "Continue to Payment"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
