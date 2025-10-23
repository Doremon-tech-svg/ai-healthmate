import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion as Motion } from "framer-motion";

const defaultAvatars = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const refDoc = doc(db, "users", user.uid);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          // initialize profile with defaults
          setProfile({
            name: "",
            age: "",
            height: "",
            weight: "",
            bmi: "",
            bio: "",
            avatar: defaultAvatars[0],
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      await setDoc(doc(db, "users", user.uid), profile, { merge: true });
      setEditMode(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!user)
    return (
      <div className="text-center py-20 text-xl font-semibold text-gray-600">
        Please log in to view your profile.
      </div>
    );

  if (loading)
    return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Motion.h1
        className="text-4xl font-extrabold text-blue-600 mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Profile
      </Motion.h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <img
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || user.displayName || "User"}`}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-400 object-cover cursor-pointer"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.name || user.displayName || user.email}
          </h2>
        </div>

        <div className="space-y-4">
          {["name", "age", "height", "weight", "bmi", "bio"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 capitalize">{field}</label>
              {editMode ? (
                <input
                  type={field === "age" || field === "height" || field === "weight" ? "number" : "text"}
                  value={profile[field] || ""}
                  onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                  className="w-full mt-1 px-4 py-2 border rounded-lg"
                  placeholder={`Enter your ${field}`}
                />
              ) : (
                <p className="text-gray-800 mt-1">{profile[field] || "Not provided"}</p>
              )}
            </div>
          ))}
        </div>

        {editMode && (
          <div className="flex space-x-2 justify-center mt-2">
            {defaultAvatars.map((avt) => (
              <img
                key={avt}
                src={avt}
                className={`w-12 h-12 rounded-full border-2 cursor-pointer ${
                  profile.avatar === avt ? "border-blue-600" : "border-gray-300"
                }`}
                onClick={() => setProfile({ ...profile, avatar: avt })}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-6 space-x-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={saveProfile}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
