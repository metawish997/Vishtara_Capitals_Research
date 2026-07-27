import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import blogService from "../services/blogService";
import { BASE_URL } from "../services/api";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await blogService.getBlogs();
        if (res.success) {
          setBlogs(res.data);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const getImageUrl = (imgObj) => {
    if (!imgObj || !imgObj.url) return null;
    if (imgObj.url.startsWith("http")) return imgObj.url;
    return `${BASE_URL}${imgObj.url}`;
  };

  return (
    <main>
         <style>{`
            html[data-theme="dark"] .tp-breadcrumb-content p,
            html[data-theme="dark"] .tp-breadcrumb-content h2.tp-breadcrumb-title,
            html[data-theme="dark"] .tp-breadcrumb-list li {
               color: #ffffff !important;
            }
            
            html[data-theme="dark"] .tp-cn-blog-item-title a,
            body.high-contrast .tp-cn-blog-item-title a {
               color: #ffffff !important;
            }
            
            .tp-blog-btn button.tp-btn {
               background-color: #FBB040 !important; 
               border-color: #FBB040 !important;
            }
            
            .tp-blog-btn button.tp-btn span.btn-text,
            .tp-blog-btn button.tp-btn i svg {
               color: #222F30 !important;
            }
            
            html[data-theme="dark"] .tp-blog-btn button.tp-btn span.btn-text,
            body.high-contrast .tp-blog-btn button.tp-btn span.btn-text {
               color: #222F30 !important;
            }
            
            .tp-blog-btn button.tp-btn:hover {
               background-color: #FBB040 !important;
               color: #222F30 !important;
               transform: none !important;
            }
            
            .tp-blog-btn button.tp-btn::after,
            .tp-blog-btn button.tp-btn::before {
               display: none !important;
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
                           <li>Blog</li>
                        </ul>
                        <h2 className="tp-breadcrumb-title">Blog</h2>
                        <p>Through digital innovation, we drive scalable growth, lead climate-positive change, <br /> and strengthen organizational excellence</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         


         
         <div className="tp-blog-ptb tp-sec-ptb upt-135 upb-110">
            <div className="container">
               <div className="row">
                  {loading ? (
                     <div className="col-12 text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                           <span className="visually-hidden">Loading...</span>
                        </div>
                     </div>
                  ) : blogs && blogs.length > 0 ? (
                     blogs.map(blog => (
                        <div key={blog._id} className="col-xl-4 col-md-6">
                           <div className="tp-cn-blog-item umb-30" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                              <div className="tp-cn-blog-item-thumb" style={{ marginBottom: '20px', borderRadius: '6px', overflow: 'hidden' }}>
                                 <Link to={`/blog/${blog.slug}`}>
                                    <img 
                                       src={getImageUrl(blog.image) || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80"} 
                                       alt={blog.title} 
                                       style={{ width: '100%', height: '220px', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                                       onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                       onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                 </Link>
                              </div>
                              <div className="tp-cn-blog-item-meta">
                                 <span className="category" style={{ textTransform: 'capitalize' }}>{blog.category?.name || "Uncategorized"}</span>
                                 <span className="date">
                                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                 </span>
                              </div>
                              <h3 className="tp-cn-blog-item-title">
                                 <Link className="tp-line-anim" to={`/blog/${blog.slug}`}>{blog.title}</Link>
                              </h3>
                              <p className="description" style={{ flexGrow: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                 {blog.short_description || (blog.content && blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)) + '...'}
                              </p>
                              <div className="tp-cn-blog-item-btn">
                                 <Link className="tp-btn tp-btn-switch-animation" to={`/blog/${blog.slug}`}>
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
                     ))
                  ) : (
                     <div className="col-12 text-center py-5">
                        <p style={{ color: '#9ca3af' }}>No blogs available at the moment.</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
         


         
      
    </main>
  );
}
