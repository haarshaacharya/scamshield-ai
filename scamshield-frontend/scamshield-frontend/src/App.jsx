import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import axios from "axios";


export default function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");

  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [reasons, setReasons] = useState([]);

  const [totalScans, setTotalScans] = useState(0);
  const [scamCount, setScamCount] = useState(0);
  const [safeCount, setSafeCount] = useState(0);

  const analyzeMessage = async () => {
    if (message.trim() === "") {
      alert("Please enter a suspicious message");
      return;
    }

    setLoading(true);
    setResult("");
    setExplanation("");
    setReasons([]);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/analyze",
        {
          message: message,
        }
      );

      const aiResponse = response.data;

      console.log(aiResponse);

      setScore(aiResponse.score || 0);
setExplanation(aiResponse.explanation || "");
setReasons(aiResponse.reasons || []);

setTotalScans(prev => prev + 1);

if ((aiResponse.risk || "").toLowerCase().includes("scam")) {
  setResult("scam");
  setScamCount(prev => prev + 1);
} else {
  setResult("safe");
  setSafeCount(prev => prev + 1);
}

    } catch (error) {
      console.log(error);
      alert("Error connecting to AI backend");
    }

    setLoading(false);
  };

  const analyzeImage = async () => {

  if (!image) {
    alert("Please select an image");
    return;
  }

  setLoading(true);

  try {

    const formData = new FormData();
    formData.append("image", image);

    const response = await axios.post(
      "http://127.0.0.1:5000/analyze-image",
      formData
    );

    const data = response.data;

    setScore(data.score || 0);
    setExplanation(data.explanation || "");
    setReasons(data.reasons || []);

    setTotalScans(prev => prev + 1);

    if ((data.risk || "").toLowerCase().includes("scam")) {
      setResult("scam");
      setScamCount(prev => prev + 1);
    } else {
      setResult("safe");
      setSafeCount(prev => prev + 1);
    }

  } catch (error) {

    console.log(error);
    alert("Image analysis failed");

  }

  setLoading(false);
};

const analyzeLink = async () => {

  if (!url.trim()) {
    alert("Enter a URL");
    return;
  }

  setLoading(true);

  try {

    const response = await axios.post(
      "http://127.0.0.1:5000/analyze-link",
      {
        url: url
      }
    );

    const data = response.data;

    setScore(data.score || 0);
    setExplanation(data.explanation || "");
    setReasons(data.reasons || []);

    setTotalScans(prev => prev + 1);

    if ((data.risk || "").toLowerCase().includes("scam")) {
      setResult("scam");
      setScamCount(prev => prev + 1);
    } else {
      setResult("safe");
      setSafeCount(prev => prev + 1);
    }

  } catch (error) {

    console.log(error);
    alert("Link analysis failed");

  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-red-500">
          ScamShield AI
        </h1>

        <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl transition">
          Report Scam
        </button>
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">

        <h1 className="text-6xl font-extrabold leading-tight">
          Detect Scams <br />
          Before They <span className="text-red-500">Destroy Trust</span>
        </h1>

        <p className="mt-6 text-gray-300 text-lg max-w-2xl">
          AI-powered scam detection system for WhatsApp messages,
          suspicious links, fake screenshots, and phishing attacks.
        </p>

        <div className="mt-10 w-full max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

  <div className="bg-gray-900 border border-gray-700 p-5 rounded-2xl">
    <h3 className="text-gray-400 text-sm">
      Total Scans
    </h3>

    <p className="text-3xl font-bold mt-2">
      {totalScans}
    </p>
  </div>

  <div className="bg-red-900 border border-red-500 p-5 rounded-2xl">
    <h3 className="text-sm">
      Scams Detected
    </h3>

    <p className="text-3xl font-bold mt-2">
      {scamCount}
    </p>
  </div>

  <div className="bg-green-900 border border-green-500 p-5 rounded-2xl">
    <h3 className="text-sm">
      Safe Messages
    </h3>

    <p className="text-3xl font-bold mt-2">
      {safeCount}
    </p>
  </div>

</div>

          {/* Message Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste suspicious message here..."
            className="w-full h-40 bg-gray-900 border border-gray-700 rounded-2xl p-5 text-lg outline-none focus:border-red-500"
          />

          <input
  type="text"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
  placeholder="Paste suspicious URL here..."
  className="w-full mt-4 bg-gray-900 border border-gray-700 rounded-2xl p-4 text-lg outline-none focus:border-blue-500"
/>

          {/* Upload Box */}
          <div className="mt-6 border-2 border-dashed border-gray-600 rounded-2xl p-10 hover:border-red-500 transition cursor-pointer">

            <div className="flex flex-col items-center">

              <FaUpload className="text-5xl text-red-500 mb-4" />

              <p className="text-lg font-semibold">
                Upload Screenshot
              </p>

              <p className="text-gray-400 mt-2 text-center">
                Scan fake payment screenshots,
                phishing messages, and scam images
              </p>

             <input
  type="file"
  accept="image/*"
  className="mt-5"
  onChange={(e) => setImage(e.target.files[0])}
/>
            </div>

          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeMessage}
            className="mt-5 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
            Analyze Message
          </button>



          <button
           onClick={analyzeImage}
           className="mt-4 ml-4 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
           Analyze Screenshot
          </button>


          <button
            onClick={analyzeLink}
            className="mt-4 ml-4 bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-2xl text-lg font-semibold transition"
          >
           Analyze Link
           </button>


          {/* Loading */}
          {loading && (
            <div className="mt-6 text-xl animate-pulse text-red-400 font-semibold">
              🔍 AI is analyzing the message...
            </div>
          )}

          {/* Scam Result */}
          {result === "scam" && (
            <div className="mt-8 bg-gradient-to-r from-red-900 to-black border border-red-500 p-8 rounded-3xl shadow-2xl">

              <h2 className="text-3xl font-bold mb-4">
                Analysis Result
              </h2>

              <div className="flex items-center justify-center mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-red-500 flex items-center justify-center text-3xl font-bold text-red-400">
                  {score}%
                </div>
              </div>

              <p className="text-2xl font-semibold text-red-400">
                ⚠️ High Scam Probability
              </p>

              <p className="mt-4 text-gray-300 text-lg">
                {explanation}
              </p>

              <div className="mt-6 text-left">
                <h3 className="text-xl font-bold mb-3 text-red-300">
                  Why Scam?
                </h3>

                {reasons.map((reason, index) => (
                  <p key={index} className="mb-2">
                    ✓ {reason}
                  </p>
                ))}
              </div>

            </div>
          )}

          {/* Safe Result */}
          {result === "safe" && (
            <div className="mt-8 bg-gradient-to-r from-green-900 to-black border border-green-500 p-8 rounded-3xl shadow-2xl">

              <h2 className="text-3xl font-bold mb-4">
                Analysis Result
              </h2>

              <div className="flex items-center justify-center mb-6">
                <div className="w-40 h-40 rounded-full border-8 border-green-500 flex items-center justify-center text-3xl font-bold text-green-400">
                  {score}%
                </div>
              </div>

              <p className="text-2xl font-semibold text-green-400">
                ✅ Message Looks Safe
              </p>

              <p className="mt-4 text-gray-300 text-lg">
                {explanation}
              </p>

              <div className="mt-6 text-left">
                <h3 className="text-xl font-bold mb-3 text-green-300">
                  Why Safe?
                </h3>

                {reasons.map((reason, index) => (
                  <p key={index} className="mb-2">
                    ✓ {reason}
                  </p>
                ))}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}