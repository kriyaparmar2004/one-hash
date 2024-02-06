import React, { useState } from "react";
import axios from "axios";
import jsPDF from 'jspdf';
import "./App.css";

// ... (existing imports)

function App() {
  const [inputText, setInputText] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [copied, setCopied] = useState(false);
  const [minHashtagLength, setMinHashtagLength] = useState(5);
  const [maxHashtagLength, setMaxHashtagLength] = useState(15);
  const [hashtagFrequencies, setHashtagFrequencies] = useState({});
  const [hoverIndex, setHoverIndex] = useState(null);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  


  const generateHashtags = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/generate_hashtags/",
        {
          text: inputText,
          selectedNumber: selectedNumber,
          minHashtagLength: minHashtagLength,
          maxHashtagLength: maxHashtagLength,
        }
      );

      const limitedHashtags = response.data.hashtags.slice(0, selectedNumber);
      const numberedHashtags = limitedHashtags.map((tag, index) => `${index + 1}. ${tag}`);

      setHashtags(numberedHashtags);
      setHashtagFrequencies(response.data.frequencies);
      setError(null);
    } catch (error) {
      console.error("Error generating hashtags:", error);
      setError("Error generating hashtags. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const hashtagsToCopy = selectAll ? hashtags : selectedHashtags;
    const hashtagsWithoutNumbering = hashtagsToCopy.map(tag => tag.replace(/^\d+\.\s/, ''));
    const hashtagsText = hashtagsWithoutNumbering.join(" ");
    navigator.clipboard
      .writeText(hashtagsText)
      .then(() => {
        console.log("Hashtags copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
      });
  };
  

  const exportHashtags = () => {
    const hashtagsToExport = selectAll ? hashtags : selectedHashtags;

    // Create an instance of jsPDF
    const pdfDoc = new jsPDF();

    // Define the content for the PDF
    const content = `
      Generated Hashtags:
      ${hashtags.join('\n')}
  
      Hashtag Frequencies:
      ${JSON.stringify(hashtagFrequencies, null, 2)}
    `;

    // Add the content to the PDF
    pdfDoc.text(content, 10, 10);

    // Save the PDF with a specific filename
    pdfDoc.save('hashtags_export.pdf');
  };

  const clearHashtags = () => {
    setInputText('');
    setHashtags([]);
    setHashtagFrequencies({});
    setSelectedHashtags([]); // Clear selected hashtags
    setError(null);
    setSelectAll(false);
  };

  const handleDragStart = (e, tag) => {
    e.dataTransfer.setData('text/plain', tag);
    setSelectedHashtags([tag]); // Set the selected tag
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
  e.preventDefault();
  const droppedTag = e.dataTransfer.getData('text/plain');
  const draggedIndex = hashtags.indexOf(droppedTag);

  // Update the state to add the dropped tag to selected hashtags
  setSelectedHashtags([droppedTag]);

  // Remove the dropped tag from the generated hashtags list
  const updatedHashtags = [...hashtags];
  updatedHashtags.splice(index, 1);
  // Insert the dropped tag at the new index
  updatedHashtags.splice(index, 0, droppedTag);

  // Update the numbering based on the new order
  const numberedHashtags = updatedHashtags.map((tag, idx) => `${idx + 1}. ${tag}`);
  setHashtags(numberedHashtags);

  setHoverIndex(null);
};

  

  

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setHoverIndex(index);
    setSelectedHashtags([hashtags[index]]); // Set the selected tag based on the hovered index
  };
  
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
  
    // If selecting all, set all hashtags as selected
    if (!selectAll) {
      setSelectedHashtags([...hashtags]);
    } else {
      // If unselecting all, clear the selected hashtags
      setSelectedHashtags([]);
    }
  };
  
  const handleCheckboxChange = (tag) => {
    const updatedSelected = [...selectedHashtags];
  
    // If the tag is already selected, remove it; otherwise, add it
    if (updatedSelected.includes(tag)) {
      updatedSelected.splice(updatedSelected.indexOf(tag), 1);
    } else {
      updatedSelected.push(tag);
    }
  
    setSelectedHashtags(updatedSelected);
  };
  

  return (
    <div className=" dark:bg-black ">
      <div className="  flex max-w-5xl mx-auto flex-col justify-center items-center">
        <h1 className="pt-10 font-extrabold text-[#001d3d] text-6xl heading">
          One-Hash
        </h1>
        <div  className="flex py-10 border bg-[#979dac] border-zinc-200  px-6 my-10 rounded-3xl max-w-8xl mx-auto gap-6 items-center">
          <div className="grid gap-6 grid-cols-1">
            <label htmlFor="numberOfHashtags" className="text-md tracking-wide text-zinc-50 heading">
              Number of Hashtags:
            </label>
            <select
              id="numberOfHashtags"
              className="p-2 border  border-zinc-200 rounded-xl"
              value={selectedNumber}
              onChange={(e) => setSelectedNumber(parseInt(e.target.value))}
            >
              <option className="bg-[#f2f4f6]  heading " value={5}>
                5
              </option>
              <option className="bg-[#f2f4f6] heading" value={10}>
                10
              </option>
              <option className="bg-[#f2f4f6] heading" value={15}>
                15
              </option>
              <option className="bg-[#f2f4f6] heading" value={20}>
                20
              </option>
            </select>
          </div>

          <div className="flex grid-cols-2 gap-6">
            <div>
              <div className="grid gap-6 grid-cols-1">
                <div>
                  <label htmlFor="minHashtagLength" className="text-md text-zinc-50 tracking-wide heading">
                    Min Hashtag Length:
                  </label>
                </div>
                <div>
                  <input
                    type="number"
                    id="minHashtagLength"
                    value={minHashtagLength}
                    onChange={(e) =>
                      setMinHashtagLength(parseInt(e.target.value))
                    }
                    className="p-2 border border-zinc-200 rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="grid gap-6 grid-cols-1">
              <div>
                <label htmlFor="maxHashtagLength" className="text-md text-zinc-50 heading tracking-wide">
                  Max Hashtag Length:
                </label>
              </div>
              <div>
                <input
                  type="number"
                  id="maxHashtagLength"
                  value={maxHashtagLength}
                  onChange={(e) =>
                    setMaxHashtagLength(parseInt(e.target.value))
                  }
                  className="p-2 border border-zinc-200 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <textarea
            className="textarea h-40 bg-[#979dac] dark:text-zinc-200 dark:bg-[#0c0c0c] rounded-4xl Paras tracking-wide w-[60svw] border border-zinc-300 dark:border-zinc-900 "
            value={inputText}
            placeholder="Enter your text here..."
            onChange={(e) => setInputText(e.target.value)}
          />

          <button
            className="btn text-lg py-2 px-4 bg-[#21b0fe] text-white heading"
            onClick={generateHashtags}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Hashtags"}
          </button>
        </div>
        {loading && (
          <div className="loader-container py-6">
            <div className="loader"></div>
          </div>
        )}
        
        <div className="py-10">
          {error && <p className="text-red-500">{error}</p>}
          <ul onDragOver={handleDragOver} className="flex flex-wrap justify-center items-center gap-4">
  {hashtags &&
    hashtags.map((tag, index) => (
      <li
        key={index}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, tag)}
        onDragEnter={(e) => handleDragEnter(e, index)}
        onDrop={(e) => handleDrop(e, index)}
        className={`border heading dark:bg-[#0c0c0c] dark:border-zinc-900 tracking-wide hover:opacity-80 bg-[#f8f7ff] border-[#b8b8ff] text-[#9381ff] font-bold w-fit py-2 px-2 rounded-2xl ${hoverIndex === index ? 'hovered' : ''}`}
      >
        <input
          type="checkbox"
          checked={selectAll || selectedHashtags.includes(tag)}
          onChange={() => handleCheckboxChange(tag)}
          className="mr-2 cursor-pointer"
        />
        <span>{tag}</span>
      </li>
    ))}
</ul>

<div className="flex justify-center space-x-4 mt-4">
  <button
    className="btn bg-blue-100 border rounded-xl border-blue-200 text-md px-4 text-blue-700 hover:bg-blue-200 heading"
    onClick={copyToClipboard}
  >
    {copied ? "Copied!" : "Copy to Clipboard"}
  </button>
  <button
    className="btn bg-green-100 hover:bg-green-200 border rounded-xl border-green-200 text-md px-4 text-green-700 heading"
    onClick={exportHashtags}
  >
    Export Hashtags
  </button>
  <button
    className="btn bg-red-100 hover:bg-red-200 border rounded-xl border-red-200 text-md px-4 text-red-700 heading"
    onClick={clearHashtags}
  >
    Clear
  </button>
  <button
    className="btn bg-indigo-700 hover:bg-indigo-800 border rounded-xl border-indigo-700 text-md px-4 text-white heading cursor-pointer"
    onClick={handleSelectAllChange}
  >
    {selectAll ? "Deselect All" : "Select All"}
  </button>
</div>


        </div>
      </div>
    </div>
  );
}

export default App;