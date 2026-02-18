import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";

export default function SharedListings() {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = searchParams.toString();

        const res = await api.get(
  `/shared-listings?${queryString}`
);

setData(res.data || []);
      } catch (error) {
        console.error("Shared fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  if (loading)
    return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold mb-6">
        Shared Listings
      </h1>

      {data.length === 0 ? (
        <div>No results found.</div>
      ) : (
        data.map((item) => (
          <div
            key={item._id}
            className="border p-4 mb-4 rounded-xl"
          >
            {item.sector && (
              <div>Sector: {item.sector}</div>
            )}
            {item.category && (
              <div>Category: {item.category}</div>
            )}
            {item.block && (
              <div>Block: {item.block}</div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
