import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import blogService from "../services/blogService";
import { BASE_URL } from "../services/api";

export default function BlogDetails() {
   const { slug } = useParams();
   const [blog, setBlog] = useState(null);
   const [latestBlogs, setLatestBlogs] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchBlogDetails = async () => {
         try {
            setLoading(true);
            const [blogRes, latestRes] = await Promise.all([
               blogService.getBlogBySlug(slug),
               blogService.getBlogs()
            ]);

            if (blogRes.success) {
               setBlog(blogRes.data);
            }
            if (latestRes.success) {
               const filteredLatest = latestRes.data.filter(b => b.slug !== slug).slice(0, 3);
               setLatestBlogs(filteredLatest);
            }
         } catch (error) {
            console.error("Error fetching blog details:", error);
         } finally {
            setLoading(false);
         }
      };
      if (slug) {
         fetchBlogDetails();
      }
   }, [slug]);

   const getImageUrl = (imgObj) => {
      if (!imgObj || !imgObj.url) return '/assets/img/blog/blog-1.jpg'; // Placeholder fallback
      if (imgObj.url.startsWith("http")) return imgObj.url;
      return `${BASE_URL}${imgObj.url}`;
   };

   if (loading) {
      return (
         <main>
            <div className="container py-5 text-center">
               <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
               </div>
            </div>
         </main>
      );
   }

   if (!blog) {
      return (
         <main>
            <div className="container py-5 text-center">
               <h3>Blog not found</h3>
               <Link to="/blog" className="tp-btn theme-bg-color mt-3">Back to Blogs</Link>
            </div>
         </main>
      );
   }

   return (
      <main>
         <style>{`
            html[data-theme="dark"] .tp-breadcrumb-content p,
            html[data-theme="dark"] .tp-breadcrumb-content h2.tp-breadcrumb-title,
            html[data-theme="dark"] .tp-breadcrumb-list li {
               color: #ffffff !important;
            }

            html[data-theme="dark"] .tp-section-title,
            html[data-theme="dark"] .postbox-details-title,
            html[data-theme="dark"] .tp-blog-details-social-title,
            html[data-theme="dark"] .tp-at-testimonial-user-name,
            html[data-theme="dark"] .postbox-details-comment-title,
            html[data-theme="dark"] .tp-blog-details-sub,
            html[data-theme="dark"] .postbox-details-text p,
            body.high-contrast .tp-section-title,
            body.high-contrast .postbox-details-title,
            body.high-contrast .tp-blog-details-social-title,
            body.high-contrast .tp-at-testimonial-user-name,
            body.high-contrast .postbox-details-comment-title,
            body.high-contrast .tp-blog-details-sub,
            body.high-contrast .postbox-details-text p {
               color: #ffffff !important;
            }

            html[data-theme="dark"] .tp-blog-details-info-list span,
            html[data-theme="dark"] .tp-blog-details-info p,
            html[data-theme="dark"] .tp-blog-details-info span,
            body.high-contrast .tp-blog-details-info-list span,
            body.high-contrast .tp-blog-details-info p,
            body.high-contrast .tp-blog-details-info span {
               color: #ffffff !important;
            }
            
            html[data-theme="dark"] .tp-blog-details-info,
            body.high-contrast .tp-blog-details-info {
               background-color: #1A2735 !important;
            }
            
            /* Latest Insights Dark Mode Styling */
            html[data-theme="dark"] .latest-insights-section .tp-section-title {
               color: #ffffff !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item {
               background-color: #1f2937 !important;
               border-color: #374151 !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item-title a {
               color: #ffffff !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item .description {
               color: #9ca3af !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item-meta .category {
               color: #60a5fa !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item-meta .date {
               color: #9ca3af !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item-user span {
               color: #d1d5db !important;
            }
            html[data-theme="dark"] .tp-cn-blog-item-user .stats svg path {
               stroke: #9ca3af !important;
            }
         `}</style>


         <div className="tp-breadcrumb-ptb upt-90 upb-70 z-index-1">
            <div className="tp-cc-chose-bg">
               <img src="/assets/img/breadcrumb/image-1.jpg" alt="" />
            </div>
            <div className="container">
               <div className="row">
                  <div className="col-lg-5">
                     <div className="tp-breadcrumb-content p-relative">
                        <ul className="tp-breadcrumb-list">
                           <li><a href="index.html">Home</a></li>
                           <li>&gt;</li>
                           <li>Blog Details</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Blog Details</h2>
                        <p>Through digital innovation, we drive scalable growth, lead climate-positive change, <br /> and strengthen organizational excellence</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-blog-area upt-100 upb-90">
            <div className="container">
               <div className="row g-4 align-items-start">
                  {/* LEFT: Image */}
                  {blog.image && (
                     <div className="col-lg-5">
                        <div style={{ position: 'sticky', top: '100px' }}>
                           <img
                              className="radius-6"
                              src={getImageUrl(blog.image)}
                              alt={blog.title}
                              style={{ width: '100%', borderRadius: '12px', objectFit: 'cover', maxHeight: '500px' }}
                           />
                           {/* Meta Info */}
                           <div style={{ backgroundColor: '#111827', padding: '20px', borderRadius: '10px', marginTop: '16px' }}>
                              <h3 style={{ color: '#ffffff', fontWeight: '600', marginBottom: '16px', fontSize: '14px', letterSpacing: '1px' }}>DETAILS:</h3>
                              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                 <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>DATE</span>
                                    <span style={{ color: '#ffffff', fontSize: '13px' }}>{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                 </li>
                                 <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>CATEGORY</span>
                                    <span style={{ color: '#ffffff', fontSize: '13px', textTransform: 'capitalize' }}>{blog.category?.name || 'Articles'}</span>
                                 </li>
                                 <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>READING TIME</span>
                                    <span style={{ color: '#ffffff', fontSize: '13px' }}>{blog.reading_time || '5'} Min</span>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* RIGHT: Content */}
                  <div className={blog.image ? "col-lg-7 ps-lg-5" : "col-lg-12"}>
                     <div className="tp-blog-details-wrapper">
                        <span className="tp-blog-details-sub mb-2 d-block" style={{ textTransform: 'capitalize', fontSize: '13px' }}>
                           Blog &gt; {blog.category?.name || 'Articles'}
                        </span>
                        <h2 className="tp-section-title mb-3">{blog.title}</h2>
                        {blog.short_description && (
                           <p style={{ fontSize: '16px', fontWeight: '500', marginBottom: '20px', lineHeight: '1.7', opacity: 0.8 }}>
                              {blog.short_description}
                           </p>
                        )}
                        <div className="postbox-details-text" dangerouslySetInnerHTML={{ __html: blog.full_description || blog.content }}>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>




         <div className="tp-blog-ptb tp-sec-ptb upt-130 upb-110 latest-insights-section">
            <div className="container">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="tp-blog-details-heading text-center umb-50">
                        <span className="tp-section-sub tp-fade-anim">Latest insights</span>
                        <h3 className="tp-section-title" data-text-split data-letters-fade-in>Fresh insights and updates. Your <br /> guide to a better work life</h3>
                     </div>
                  </div>
               </div>
               <div className="row">
                  {latestBlogs.map((lb, index) => (
                     <div key={lb._id} className="col-xl-4 col-md-6 tp-fade-anim" data-delay={`.${3 + index * 2}`}>
                        <div className="tp-cn-blog-item umb-30" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                           <div className="tp-cn-blog-item-thumb umb-20" style={{ overflow: 'hidden', borderRadius: '8px' }}>
                              <Link to={`/blog/${lb.slug}`}>
                                 <img src={getImageUrl(lb.image)} alt={lb.title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                              </Link>
                           </div>
                           <div className="tp-cn-blog-item-meta">
                              <span className="category" style={{ textTransform: 'capitalize' }}>{lb.category?.name || "Uncategorized"}</span>
                              <span className="date">
                                 {new Date(lb.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                           </div>
                           <h3 className="tp-cn-blog-item-title">
                              <Link className="tp-line-anim" to={`/blog/${lb.slug}`}>{lb.title}</Link>
                           </h3>
                           <p className="description" style={{ flexGrow: 1 }}>
                              {lb.short_description || (lb.content && lb.content.replace(/<[^>]*>?/gm, '').substring(0, 100)) + '...'}
                           </p>
                           <div className="tp-cn-blog-item-user mt-auto">
                              <div className="user-info">
                                 <img src="/assets/img/consulting/blog/user-1.jpg" alt="Admin" />
                                 <span>By <strong>Admin</strong></span>
                              </div>
                              <div className="stats">
                                 <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                       <path d="M12.7218 6.41668C12.7241 7.29659 12.519 8.1646 12.1232 8.95001C11.6539 9.89117 10.9325 10.6828 10.0397 11.2362C9.14697 11.7896 8.11813 12.0829 7.06844 12.0833C6.1906 12.0856 5.32463 11.88 4.54106 11.4833L0.75 12.75L2.01369 8.95001C1.61791 8.1646 1.41281 7.29659 1.4151 6.41668C1.41551 5.36452 1.70815 4.33325 2.26025 3.43838C2.81236 2.54352 3.60211 1.8204 4.54106 1.35002C5.32463 0.953306 6.1906 0.747725 7.06844 0.750019H7.40099C8.78729 0.82668 10.0967 1.41319 11.0784 2.39726C12.0602 3.38132 12.6453 4.69378 12.7218 6.08334V6.41668Z" stroke="#586C6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {lb.view_count || 0}
                                 </span>
                                 <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14" fill="none">
                                       <path d="M10.4178 6.75397C10.4178 8.18962 9.26042 9.34974 7.82814 9.34974C6.39586 9.34974 5.23847 8.18962 5.23847 6.75397C5.23847 5.31832 6.39586 4.1582 7.82814 4.1582C9.26042 4.1582 10.4178 5.31832 10.4178 6.75397Z" stroke="#586C6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                       <path d="M7.82819 12.75C10.3817 12.75 12.7616 11.2418 14.4181 8.63157C15.0691 7.60921 15.0691 5.89078 14.4181 4.86843C12.7616 2.25816 10.3817 0.75 7.82819 0.75C5.27469 0.75 2.8948 2.25816 1.23828 4.86843C0.587241 5.89078 0.587241 7.60921 1.23828 8.63157C2.8948 11.2418 5.27469 12.75 7.82819 12.75Z" stroke="#586C6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {lb.like_count || 0}
                                 </span>
                              </div>
                           </div>
                           <div className="tp-cn-blog-item-btn">
                              <Link className="tp-btn tp-btn-switch-animation" to={`/blog/${lb.slug}`}>
                                 <span className="d-flex align-items-center justify-content-center">
                                    <span className="btn-text">
                                       Read more
                                    </span>
                                    <i className="btn-icon"></i>
                                    <i className="btn-icon"></i>
                                 </span>
                              </Link>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>






      </main>
   );
}
