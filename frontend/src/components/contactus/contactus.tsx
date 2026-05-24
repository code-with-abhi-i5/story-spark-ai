import { useState, useRef } from "react";
import type { ChangeEvent, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type FormData = {
  fullname: string;
  email: string;
  subject: string;
  message: string;
};

type FormField = "fullname" | "email" | "subject" | "message";

const INITIAL_FORM_DATA: FormData = {
  fullname: "",
  email: "",
  subject: "",
  message: "",
};

const SERVICE_KEY = import.meta.env.VITE_SERVICE_KEY ?? "";
const TEMPLATE_KEY = import.meta.env.VITE_TEMPLATE_KEY ?? "";
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY ?? "";

const contactInfo = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email Us",
    value: "support@storyspark.ai",
    color: "blue",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    label: "Join Community",
    value: "Discord & GitHub",
    color: "purple",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Response Time",
    value: "Within 24 hours",
    color: "indigo",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  // GSAP Entry Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Heading animations
    tl.from(".contact-badge", {
      y: -20,
      opacity: 0,
      duration: 0.5,
    });

    tl.from(".contact-heading", {
      y: 40,
      opacity: 0,
      duration: 0.6,
    }, "-=0.2");

    tl.from(".contact-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.5,
    }, "-=0.3");

    // Left column info cards stagger
    tl.from(".contact-info-card", {
      x: -40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.12,
    }, "-=0.2");

    // Right column form
    tl.from(".contact-form-card", {
      x: 40,
      opacity: 0,
      duration: 0.6,
    }, "-=0.4");

    // Form fields stagger
    tl.from(".contact-field", {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.08,
    }, "-=0.3");

  }, { scope: sectionRef });

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const fieldName = e.target.name as FormField;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const validateForm = (): boolean => {
    const trimmedData = {
      fullname: formData.fullname.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    };

    if (
      !trimmedData.fullname ||
      !trimmedData.email ||
      !trimmedData.subject ||
      !trimmedData.message
    ) {
      setError("All fields are required.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      setError("Invalid email address.");
      return false;
    }

    return true;
  };

  const submitHandler = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess(false);

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);

    try {
      await emailjs.send(
        SERVICE_KEY,
        TEMPLATE_KEY,
        {
          fullname: formData.fullname.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
        },
        PUBLIC_KEY,
      );
      setSuccess(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (err: unknown) {
      console.error("EmailJS Error:", err);
      setError("✕ Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 md:px-10 lg:px-20 py-16 sm:py-24 relative overflow-hidden"
    >
      {/* Background Glow Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="contact-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase">We'd love to hear from you</span>
          </div>

          <h2 className="contact-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5">
            Get In <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Touch</span>
          </h2>

          <p className="contact-subtitle max-w-xl mx-auto text-slate-400 text-lg leading-relaxed">
            Have a question, feedback, or partnership idea? Drop us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">

          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Cards */}
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-info-card group flex items-start gap-4 p-5 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors
                  ${info.color === 'blue' ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30' : ''}
                  ${info.color === 'purple' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30' : ''}
                  ${info.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30' : ''}
                `}>
                  {info.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 mb-1">{info.label}</h4>
                  <p className="text-sm text-slate-400">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={submitHandler}
              className="contact-form-card bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 md:p-10 space-y-5 shadow-2xl"
            >
              {/* Two inline fields: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="contact-field relative">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    placeholder="John Doe"
                    value={formData.fullname}
                    onChange={changeHandler}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-slate-600/50"
                    required
                  />
                </div>
                <div className="contact-field relative">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={changeHandler}
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-slate-600/50"
                    required
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="contact-field">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={changeHandler}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-slate-600/50"
                  required
                />
              </div>

              {/* Message */}
              <div className="contact-field">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <textarea
                  rows={6}
                  name="message"
                  placeholder="Tell us about your idea, feedback, or question..."
                  value={formData.message}
                  onChange={changeHandler}
                  className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3.5 text-sm text-slate-200 placeholder-slate-600 outline-none resize-none transition-all duration-300 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-slate-600/50"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="contact-field w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-base transition-all duration-300 shadow-[0_0_25px_rgba(79,70,229,0.3)] hover:shadow-[0_0_35px_rgba(79,70,229,0.5)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>

              {/* Success Message */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-green-400 text-sm font-medium">
                    Message sent successfully! We'll get back to you within 24 hours.
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Community Section - Full Width Bottom */}
        <div className="contact-info-card mt-14 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-bold text-slate-100 mb-2">Join the Community</h4>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-2xl">
                Connect with fellow writers and creators. Get early access to new AI features, share stories, and participate in writing challenges.
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:-translate-y-0.5 transition-all duration-300 text-sm font-bold shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
                  Discord
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:-translate-y-0.5 transition-all duration-300 text-sm font-bold shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
                <a href="#" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:-translate-y-0.5 transition-all duration-300 text-sm font-bold shadow-lg">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
