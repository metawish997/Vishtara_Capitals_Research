import React, { useState, useEffect } from "react";
import newsService from "../../services/newsService";
import { BASE_URL } from "../../services/api";

export default function LatestNews() {
  const [filter, setFilter] = useState("NEWEST");
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await newsService.getNews();
      const published = res.data.filter(n => n.status === 'published');
      setNewsArticles(published);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const sortedArticles = [...newsArticles].sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt);
    const dateB = new Date(b.created_at || b.createdAt);
    if (filter === "NEWEST") return dateB - dateA;
    if (filter === "OLDEST") return dateA - dateB;
    return 0;
  });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: "#1E293B", padding: "10px 0" }}>
      
      <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-15">
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#e28743", letterSpacing: "1px", textTransform: "uppercase" }}>Live Intelligence Feed</span>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "4px 0 0 0", fontFamily: "Playfair Display, Georgia, serif" }}>Market Intelligence</h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: "20px" }}>
            <span style={{ color: "#ef4444", fontSize: "14px" }}>●</span> LIVE
          </div>
          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>ARTICLES <strong style={{ color: "#0f172a" }}>{newsArticles.length}</strong></span>
          <button onClick={fetchNews} disabled={loading} style={{
            backgroundColor: "#243F63",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.2s",
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#1A2B40" }}
          onMouseOut={(e) => { if(!loading) e.currentTarget.style.backgroundColor = "#243F63" }}
          >
            {loading ? '⏳ FETCHING...' : '🔄 REFRESH'}
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid #e2e8f0", paddingBottom: "15px", marginBottom: "25px" }}>
        {["NEWEST", "OLDEST"].map((option) => {
          const isSelected = filter === option;
          return (
            <button
              key={option}
              onClick={() => setFilter(option)}
              style={{
                border: isSelected ? "none" : "1px solid #cbd5e1",
                backgroundColor: isSelected ? "var(--tp-finance-primary)" : "#ffffff",
                color: isSelected ? "#ffffff" : "#475569",
                borderRadius: "4px",
                padding: "6px 14px",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
        {sortedArticles.map((article, idx) => (
          <div key={article._id || idx} style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "24px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.01)",
            overflow: "hidden"
          }}>
            
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ fontSize: "11px", fontWeight: "700", color: "#64748b" }}>
              <span>{(article.source_name || article.category?.name || "NEWS").toUpperCase()}</span>
              <span>{new Date(article.created_at || article.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }).toUpperCase()}</span>
            </div>

            <h3 style={{
              fontSize: "20px",
              fontWeight: "800",
              color: "#0f172a",
              lineHeight: "1.4",
              marginBottom: "16px",
              fontFamily: "Playfair Display, Georgia, serif"
            }}>
              {article.title}
            </h3>

            {article.image && (
              <div style={{ width: "100%", height: "260px", overflow: "hidden", borderRadius: "6px", marginBottom: "16px" }}>
                <img src={`${BASE_URL}${article.image.url}`} alt={article.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}

            <p style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#475569",
              marginBottom: "16px"
            }}>
              {article.short_description || "No summary available."}
            </p>

            {(article.content || article.full_description) && (
              <div 
                style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569", marginBottom: "16px", borderTop: "1px dashed #e2e8f0", paddingTop: "16px" }}
                dangerouslySetInnerHTML={{ __html: article.full_description || article.content }} 
              />
            )}

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-10" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {article.news_type && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "800",
                    backgroundColor: article.news_type === 'breaking' ? '#fef2f2' : '#eff6ff',
                    color: article.news_type === 'breaking' ? '#ef4444' : '#3b82f6',
                    textTransform: "uppercase"
                  }}>
                    {article.news_type}
                  </span>
                )}
                {article.is_featured && (
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: "800",
                    backgroundColor: "#f5f3ff",
                    color: "#8b5cf6",
                    textTransform: "uppercase"
                  }}>
                    FEATURED
                  </span>
                )}
              </div>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                Category: <strong style={{ color: "#334155" }}>{article.category?.name || "General"}</strong>
              </span>
            </div>

          </div>
        ))}

        {!loading && sortedArticles.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#64748b", fontSize: "14px", fontWeight: "500", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
            No news articles available at the moment.
          </div>
        )}
      </div>

    </div>
  );
}
