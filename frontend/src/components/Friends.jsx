import { useState, useMemo } from "react";
import { Search, Check, X } from "lucide-react";

const Friends = (
  {
  friends = [],                // array of strings e.g. ["Suchet", "Tejas"]
  incomingRequests = [],       // array of strings e.g. ["Uday", "Aarya"]
  onAccept = () => {},
  onReject = () => {},
  }
) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = useMemo(() => {
    return friends.filter((name) =>
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [friends, searchTerm]);

  return (
    <div className="absolute right-4 top-16 w-80 bg-white shadow-2xl rounded-2xl border border-gray-200 p-4 text-gray-800 z-50">
      {/* Search */}
      <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 mb-4">
        <Search className="h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search username..."
          className="ml-2 bg-transparent outline-none w-full text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Friends */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Friends</h3>
        {filteredFriends.length > 0 ? (
          <ul className="space-y-1">
            {filteredFriends.map((name, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
              >
                <span className="text-sm">{name}</span>
                <span className="text-xs text-green-500 font-medium">
                  ● Online
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic">No friends found</p>
        )}
      </div>

      {/* Incoming Requests */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Incoming Requests
        </h3>
        {incomingRequests.length > 0 ? (
          <ul className="space-y-2">
            {incomingRequests.map((name, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
              >
                <span className="text-sm">{name}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAccept(name)}
                    className="bg-green-500 hover:bg-green-600 text-white p-1 rounded-md"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={() => onReject(name)}
                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-md"
                  >
                    <X size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic">No incoming requests</p>
        )}
      </div>
    </div>
  );
};

export default Friends;
