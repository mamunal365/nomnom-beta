import React, { useState, useMemo, useEffect } from "react";
import { Search, Star, MapPin, Camera, PlusCircle, LogIn, X, Filter } from "lucide-react";

// Mock data
const MOCK_RESTAURANTS = [
  {
    id: "r1",
    name: "BunBun Banh Mi",
    area: "Banani",
    cuisine: ["Vietnamese", "Sandwich"],
    price: "$$",
    rating: 4.6,
    reviews: 142,
    tags: ["Kid friendly", "Non smoking"],
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    menu: [
      { name: "Classic Banh Mi", price: 380 },
      { name: "Grilled Chicken Banh Mi", price: 420 },
      { name: "Iced Coffee", price: 220 },
    ],
    description:
      "Crisp baguettes with bold fillings. Cosy spot for a quick bite and coffee.",
  },
  {
    id: "r2",
    name: "Chaa Club",
    area: "Dhanmondi",
    cuisine: ["Cafe", "Dessert"],
    price: "$",
    rating: 4.2,
    reviews: 89,
    tags: ["Work friendly", "WiFi"],
    img: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop",
    menu: [
      { name: "Masala Chai", price: 180 },
      { name: "Cheesecake Slice", price: 320 },
      { name: "Chicken Sandwich", price: 350 },
    ],
    description:
      "Tea focused cafe with calm vibes and power sockets at every table.",
  },
  {
    id: "r3",
    name: "Kacchi Stories",
    area: "Uttara",
    cuisine: ["Bangladeshi"],
    price: "$$$",
    rating: 4.8,
    reviews: 512,
    tags: ["Family", "Parking"],
    img: "https://images.unsplash.com/photo-1617195737496-87df82d906b6?q=80&w=1200&auto=format&fit=crop",
    menu: [
      { name: "Kacchi Platter", price: 780 },
      { name: "Borhani", price: 120 },
      { name: "Firni", price: 160 },
    ],
    description:
      "Rich kacchi with generous portions, perfect for gatherings.",
  },
];

// Simple storage helpers
const loadLocal = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback }
}
const saveLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val))

export default function App() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [active, setActive] = useState(null); // restaurant id
  const [user, setUser] = useState(() => loadLocal("nom_user", null));
  const [reviews, setReviews] = useState(() => loadLocal("nom_reviews", {})); // { [rid]: [review] }
  const [bookmarks, setBookmarks] = useState(() => loadLocal("nom_bookmarks", []));

  useEffect(() => saveLocal("nom_reviews", reviews), [reviews])
  useEffect(() => saveLocal("nom_bookmarks", bookmarks), [bookmarks])
  useEffect(() => saveLocal("nom_user", user), [user])

  const restaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = [...MOCK_RESTAURANTS]
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.cuisine.join(" ").toLowerCase().includes(q)
      )
    }
    return list
  }, [query])

  const openDetails = (id) => {
    setActive(id)
    setTab("details")
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Header query={query} setQuery={setQuery} setTab={setTab} setFiltersOpen={setFiltersOpen} />

      {tab === "home" && (
        <div className="max-w-5xl mx-auto p-4 space-y-6">
          <Hero onExplore={() => setTab("search")} />
          <Section title="Trending this week">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => (
                <RestaurantCard key={r.id} r={r} onOpen={() => openDetails(r.id)}
                  bookmarked={bookmarks.includes(r.id)}
                  toggleBookmark={() => setBookmarks(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
                />
              ))}
            </div>
          </Section>
        </div>
      )}

      {tab === "search" && (
        <div className="max-w-5xl mx-auto p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={18} />
            <button className="text-sm underline" onClick={() => setFiltersOpen(true)}>Open filters</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map(r => (
              <RestaurantCard key={r.id} r={r} onOpen={() => openDetails(r.id)}
                bookmarked={bookmarks.includes(r.id)}
                toggleBookmark={() => setBookmarks(prev => prev.includes(r.id) ? prev.filter(i => i !== r.id) : [...prev, r.id])}
              />
            ))}
          </div>
        </div>
      )}

      {tab === "details" && active && (
        <RestaurantDetails
          r={MOCK_RESTAURANTS.find(x => x.id === active)}
          onBack={() => setTab("home")}
          user={user}
          reviews={reviews[active] || []}
          onAddReview={(rev) => setReviews(prev => ({ ...prev, [active]: [rev, ...(prev[active] || [])] }))}
        />
      )}

      {tab === "login" && (
        <Login onLogin={(u) => { setUser(u); setTab("home") }} onCancel={() => setTab("home")} />
      )}

      {filtersOpen && (
        <Modal onClose={() => setFiltersOpen(false)}>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            <p className="text-sm text-neutral-600">This is a placeholder. We can add cuisine, area, price, kid friendly, non smoking and rating.</p>
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 rounded-xl bg-neutral-200" onClick={() => setFiltersOpen(false)}>Cancel</button>
              <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={() => setFiltersOpen(false)}>Apply</button>
            </div>
          </div>
        </Modal>
      )}

      <TabBar setTab={setTab} />
    </div>
  );
}

function Header({ query, setQuery, setTab, setFiltersOpen }) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
      <div className="max-w-5xl mx-auto p-4 flex items-center gap-3">
        <div className="font-black text-xl">NomNom</div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-neutral-100 focus:bg-white focus:ring-2 focus:ring-neutral-200 outline-none"
            placeholder="Search by place, cuisine or area"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setTab("search")}
          />
        </div>
        <button
          className="px-3 py-2 rounded-xl bg-black text-white text-sm hidden sm:block"
          onClick={() => setFiltersOpen(true)}
        >Filters</button>
        <button className="ml-auto" onClick={() => setTab("login")}>
          <LogIn />
        </button>
      </div>
    </div>
  )
}

function Hero({ onExplore }) {
  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-amber-100 to-orange-100 border">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src="https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop" alt="Food"
             className="rounded-2xl w-full md:w-1/2 object-cover" />
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold">Find honest food spots in Dhaka</h1>
          <p className="text-neutral-700">Short reviews, real photos and verified ratings from local food lovers. Start with trending picks or search by mood and budget.</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={onExplore}>Explore now</button>
            <button className="px-4 py-2 rounded-xl bg-white border">Add a review</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold">{title}</h2>
      {children}
    </div>
  )
}

function RestaurantCard({ r, onOpen, bookmarked, toggleBookmark }) {
  return (
    <div className="rounded-2xl overflow-hidden border bg-white">
      <div className="relative">
        <img src={r.img} alt={r.name} className="h-44 w-full object-cover" />
        <button
          className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${bookmarked ? "bg-black text-white" : "bg-white"}`}
          onClick={toggleBookmark}
        >{bookmarked ? "Saved" : "Save"}</button>
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{r.name}</div>
          <div className="flex items-center gap-1"><Star size={16} />{r.rating}</div>
        </div>
        <div className="text-sm text-neutral-600 flex items-center gap-1"><MapPin size={14} />{r.area} • {r.price}</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {r.cuisine.map(c => (
            <span key={c} className="text-xs px-2 py-1 rounded-full bg-neutral-100 border">{c}</span>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <button className="text-sm underline" onClick={onOpen}>View details</button>
          <button className="flex items-center gap-1 text-sm"><Camera size={16} /> Add photo</button>
        </div>
      </div>
    </div>
  )
}

function RestaurantDetails({ r, onBack, user, reviews, onAddReview }) {
  const [text, setText] = useState("");
  const [stars, setStars] = useState(0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <button className="mb-4 underline" onClick={onBack}>Back</button>
      <div className="rounded-2xl overflow-hidden border bg-white">
        <img src={r.img} alt={r.name} className="h-64 w-full object-cover" />
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{r.name}</h2>
            <div className="flex items-center gap-1"><Star size={18} />{r.rating} <span className="text-neutral-500 text-sm">({r.reviews})</span></div>
          </div>
          <div className="text-sm text-neutral-600 flex items-center gap-1"><MapPin size={14} />{r.area} • {r.price}</div>
          <p className="text-neutral-700">{r.description}</p>
          <h3 className="font-semibold mt-4">Popular items</h3>
          <ul className="grid sm:grid-cols-2 gap-2">
            {r.menu.map(m => (
              <li key={m.name} className="flex items-center justify-between rounded-xl border p-2 bg-neutral-50">
                <span>{m.name}</span><span className="font-semibold">৳{m.price}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 p-3 rounded-xl bg-neutral-50 border">
            <div className="font-semibold mb-2">Add your review</div>
            {!user && <p className="text-sm mb-2">You need to log in to post a review.</p>}
            <div className="flex items-center gap-2 mb-2">
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setStars(i)} className={`p-1 rounded ${i <= stars ? "bg-amber-200" : "bg-white border"}`}>
                  <Star size={18} />
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-2 rounded-xl border bg-white"
              placeholder="Short and honest. What did you try and how was it"
              rows={3}
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={!user}
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50"
                disabled={!user || stars === 0 || text.trim().length < 5}
                onClick={() => {
                  onAddReview({ id: Date.now(), user: user?.name || "Guest", stars, text, date: new Date().toISOString() })
                  setText(""); setStars(0)
                }}
              >Post review</button>
            </div>
          </div>
          <h3 className="font-semibold mt-4">Recent reviews</h3>
          <div className="space-y-2">
            {reviews.length === 0 && <p className="text-sm text-neutral-600">No reviews yet. Be the first.</p>}
            {reviews.map(rv => (
              <div key={rv.id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{rv.user}</div>
                  <div className="flex items-center gap-1"><Star size={16} />{rv.stars}</div>
                </div>
                <div className="text-sm text-neutral-700 mt-1">{rv.text}</div>
                <div className="text-xs text-neutral-500 mt-1">{new Date(rv.date).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border bg-white p-4">
        <h3 className="font-semibold mb-2">Map</h3>
        <div className="h-48 rounded-xl bg-neutral-100 grid place-items-center text-neutral-500">
          <div className="flex items-center gap-2"><MapPin /> Map placeholder</div>
        </div>
      </div>
    </div>
  )
}

function Login({ onLogin, onCancel }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="rounded-2xl border bg-white p-5 space-y-3">
        <h2 className="text-xl font-bold">Log in</h2>
        <input className="w-full p-2 rounded-xl border" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full p-2 rounded-xl border" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded-xl bg-neutral-200" onClick={onCancel}>Cancel</button>
          <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={() => onLogin({ name, email })}>Continue</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-20">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-lg p-4">
        <div className="rounded-2xl border bg-white p-4 relative shadow-xl">
          <button className="absolute right-3 top-3" onClick={onClose}><X size={18} /></button>
          {children}
        </div>
      </div>
    </div>
  )
}

function TabBar({ setTab }) {
  return (
    <div className="sticky bottom-0 bg-white border-t">
      <div className="max-w-5xl mx-auto p-2 grid grid-cols-4 gap-2">
        <TabButton icon={<Search size={18} />} label="Home" onClick={() => setTab("home")} />
        <TabButton icon={<MapPin size={18} />} label="Discover" onClick={() => setTab("search")} />
        <TabButton icon={<PlusCircle size={18} />} label="Review" onClick={() => setTab("details")} />
        <TabButton icon={<LogIn size={18} />} label="Login" onClick={() => setTab("login")} />
      </div>
    </div>
  )
}

function TabButton({ icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-neutral-100">
      <div>{icon}</div>
      <div className="text-xs">{label}</div>
    </button>
  )
}
