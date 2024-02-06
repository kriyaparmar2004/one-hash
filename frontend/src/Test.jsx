return (
  <div className={`dark:bg-black ${typography.text}`}>
    <div className="flex max-w-5xl mx-auto flex-col justify-center items-center">
      <h1 className={`pt-10 ${typography.heading}`}>
        Hashtag Generator
      </h1>
      <div className={`flex py-10 border bg-white border-gray-300 px-6 my-10 rounded-3xl max-w-8xl mx-auto gap-6 items-center`}>
        <div className="grid gap-6 grid-cols-1">
          {/* ... other components ... */}
        </div>

        <div className="flex grid-cols-2 gap-6">
          <div>
            <div className="grid gap-6 grid-cols-1">
              {/* ... other components ... */}
            </div>
          </div>
        </div>

        <div>
          <div className="grid gap-6 grid-cols-1">
            {/* ... other components ... */}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* ... other components ... */}
      </div>

      <div className="py-10">
        {error && <p className="text-red-500">{error}</p>}
        <ul onDragOver={handleDragOver} className="flex flex-wrap justify-center items-center gap-4">
          {/* ... other components ... */}
        </ul>

        <div className="flex justify-center space-x-4 mt-4">
          {/* ... other components ... */}
        </div>
      </div>
    </div>
  </div>
);
