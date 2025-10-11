import React, { useState } from "react";
import { ResponsiveDialog } from "../ui/responsive-dialog";
import Image from "next/image";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

const WaitListModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [fullName, setFullName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFullName("");
    setWhatsappNumber("");
    setEmail("");
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_URL}/waitlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, whatsappNumber, email }),
      });
      if (res.ok) {
        toast.success("Successfully joined the waitlist");
        resetForm();
        setOpen(false);
      } else {
        const error = await res.json();
        throw new Error(error.response.message);
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        if (err.message.includes("duplicate key")) {
          toast.error("You have already joined the waitlist");
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveDialog open={open} setOpen={setOpen}>
      <div className="max-w-5xl mx-auto p-4 md:p-8 overflow-y-auto relative">
        <div className="absolute top-2 md:top-5 right-5 md:right-0 ">
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-2 w-max text-black font-bold text-lg">
              <span className="text-2xl">⊕</span> JustGo Health
            </p>
          </div>
        </div>
        <div className="flex items-center pt-10 justify-between mb-2">
          <div />
          <p className="text-xl md:text-3xl font-bold text-[#8B5CB1] text-center w-full block">
            Join The Waitlist
          </p>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-center mb-6 mt-2">
          The Dwen Wo Ho campaign by JustGo Health
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="flex-shrink-0 col-span-2 w-full h-full min-h-[400px]">
            <Image
              src="/cat.jpg"
              alt="cat"
              className="rounded-xl w-full h-full object-cover"
              width={1000}
              height={1000}
            />
          </div>
          <form
            className="flex-1 w-full flex flex-col justify-between gap-4 col-span-3"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Name"
                className="border border-black rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="WhatsApp No."
                className="border border-black rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                required
              />
              <div className="text-black text-base font-medium -mt-2 mb-2">
                Get exclusive access to our clinical team on WhatsApp now.
              </div>
              <input
                type="email"
                placeholder="Email"
                className="border border-black rounded-lg px-4 py-3 text-lg w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                className="bg-[#2BA36A] text-black text-2xl font-bold rounded px-6 py-2 disabled:opacity-50"
                disabled={loading || !fullName || !whatsappNumber || !email}
              >
                {loading ? "Loading..." : "GO"}
              </button>
            </div>
            {success && (
              <div className="text-green-600 font-bold text-center">
                Successfully joined the waitlist!
              </div>
            )}
            {error && <div className="text-red-600 font-bold text-center">{error}</div>}
          </form>
        </div>
      </div>
    </ResponsiveDialog>
  );
};

export default WaitListModal;
