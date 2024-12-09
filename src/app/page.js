"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const EmailForm = () => {
  const [email, setEmail] = useState("");
  const [notFound, setNotFound] = useState(false)
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`/api/check-email?Email_address=${email}`).then(res => {
      console.log({ res })
      if (res?.data?.exists) {
        toast.success("Email Successfully Verified!")
        router.push("/home")
      }
      else {
        toast.error("Email not found please register first")
        setNotFound(true)
      }
    })
      .catch(err => {
        toast.error(err?.message)
      })
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-4 bg-white shadow-md rounded-lg"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Enter you Email
        </h2>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
        {notFound &&
          <div className="mt-4">
            <a href="https://outlook.office365.com/" target="_blank">
              <img className="h-6 mx-auto cursor-pointer" src="/link.png" alt="" />
            </a>
          </div>
        }
      </form>
    </div>
  );
};

export default EmailForm;
