"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFetchArticles,
  useFetchVideos,
  useFetchGallery,
} from "../hooks/useFetchPage";
import Loading from "../components/Loading";
import Image from "next/image";
import Link from "next/link";
import { getAlbums, getAlbumById, urlFor } from "../sanity/utils";
import { ChevronRight, Calendar, Tag, FileX } from "lucide-react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Pagination from "../components/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

// Create a separate component for the content that uses useSearchParams
const MediaContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Group ALL hooks at the top level
  const [activeTab, setActiveTab] = useState("Articles");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Add new state for album lightbox
  const [albumLightboxOpen, setAlbumLightboxOpen] = useState(false);
  const [selectedAlbumImageIndex, setSelectedAlbumImageIndex] = useState(0);

  // Custom hooks for fetching data
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
  } = useFetchArticles();

  const {
    videos,
    loading: videosLoading,
    error: videosError,
  } = useFetchVideos();

  const {
    gallery,
    loading: galleryLoading,
    error: galleryError,
  } = useFetchGallery();

  // 2. Define derived variables AFTER all hooks are called
  const loading = articlesLoading || videosLoading || galleryLoading;
  const error = articlesError || videosError || galleryError;
  const itemsPerPage = 6;

  // 3. This useEffect must come after all state hooks
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["Articles", "Videos", "Gallery"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // 4. Always define this useEffect in the same position
  useEffect(() => {
    if (activeTab === "Gallery") {
      setIsLoading(true);
      getAlbums()
        .then((data) => {
          setAlbums(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching albums:", error);
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  // 5. Define these functions AFTER all hooks
  const openLightbox = (index) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleAlbumClick = async (albumId) => {
    setIsLoading(true);
    try {
      const albumData = await getAlbumById(albumId);
      setSelectedAlbum(albumData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching album details:", error);
      setIsLoading(false);
    }
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    router.push(`/media?tab=${tab}`, undefined, { shallow: true });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const openAlbumLightbox = (index) => {
    setSelectedAlbumImageIndex(index);
    setAlbumLightboxOpen(true);
  };

  const closeAlbumLightbox = () => {
    setAlbumLightboxOpen(false);
  };

  // 6. Define this AFTER all hooks and functions
  const tabContent = {
    Articles: articles || [],
    Videos: videos || [],
    Gallery: albums || [],
  };

  // 7. Calculate pagination data AFTER tabContent is defined
  const paginatedData =
    tabContent[activeTab]?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    ) || [];

  const totalPages = Math.ceil(
    (tabContent[activeTab]?.length || 0) / itemsPerPage
  );

  // 8. Now, render based on the loading state
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error loading media content</div>;
  }

  return (
    <>
      {/* Tabs Section */}
      <div className="bg-white shadow-md py-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-center space-x-4">
          {Object.keys(tabContent).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-lg text-lg font-semibold ${
                activeTab === tab
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-all duration-300 ease-in-out`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Media Content */}
      <div className="container mx-auto py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-5">
              {activeTab}
            </h2>
            {activeTab === "Articles" && (
              <p className="text-gray-700 text-center mb-10 max-w-lg mx-auto">
                Stay informed on project updates and stories from the field.
              </p>
            )}
            {activeTab === "Videos" && (
              <p className="text-gray-700 text-center mb-10 max-w-lg mx-auto">
                Watch inspiring videos that showcase our work
              </p>
            )}
            {activeTab === "Gallery" && (
              <p className="text-gray-700 text-center mb-10 max-w-lg mx-auto">
                Explore a collection of moments captured to tell our story
              </p>
            )}
            {paginatedData.length > 0 ? (
              <>
                {activeTab === "Articles" && (
                  <div className="space-y-8 max-w-4xl mx-auto">
                    {paginatedData.map((article, index) => (
                      <motion.div
                        key={article.slug.current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col md:flex-row"
                      >
                        <Image
                          src={
                            urlFor(article.image).url() || "/placeholder.svg"
                          }
                          width={544}
                          height={300}
                          alt={article.title}
                          className="object-cover object-center w-full md:w-1/3 h-64 md:h-auto"
                        />
                        <div className="p-6 md:w-2/3 flex flex-col justify-between">
                          <div>
                            <h3 className="text-2xl font-bold text-green-700 mb-2">
                              {article.title}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <Calendar size={16} className="mr-2" />
                              <span>{formatDate(article._createdAt)}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {article.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                                >
                                  <Tag size={12} className="mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mt-2">
                              {article.excerpt}
                            </p>
                          </div>
                          <Link
                            href={`/media/${article.slug.current}`}
                            className="mt-4 inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
                          >
                            Read More <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {activeTab === "Videos" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedData.map((video, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
                      >
                        <div className="relative aspect-video">
                          <Image
                            src={`https://img.youtube.com/vi/${new URL(
                              video.link
                            ).searchParams.get("v")}/hqdefault.jpg`}
                            alt={video.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-xl"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center"
                            >
                              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-green-600 border-b-8 border-b-transparent ml-1" />
                            </motion.div>
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-green-700 mb-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-600 mb-4">
                            {video.description}
                          </p>
                          <a
                            href={video.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
                          >
                            Watch Now <ChevronRight className="ml-1 h-4 w-4" />
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                {activeTab === "Gallery" && (
                  <div>
                    {loading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                      </div>
                    ) : selectedAlbum ? (
                      // Album Detail View
                      <div>
                        <div className="flex items-center mb-6">
                          <button
                            onClick={handleBackToAlbums}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Back to Albums
                          </button>
                          <h2 className="text-3xl font-bold text-gray-800 ml-4">
                            {selectedAlbum.title}
                          </h2>
                        </div>

                        {selectedAlbum.description && (
                          <p className="text-gray-600 mb-6">
                            {selectedAlbum.description}
                          </p>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {selectedAlbum.images?.map((image, index) => (
                            <div
                              key={image.asset._id || index}
                              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
                              onClick={() => openAlbumLightbox(index)}
                            >
                              <img
                                src={urlFor(image).width(600).height(400).url()}
                                alt={image.alt || `Image ${index + 1}`}
                                className="w-full h-64 object-cover"
                              />
                              {image.caption && (
                                <div className="p-4">
                                  <p className="text-gray-700">
                                    {image.caption}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Album List View
                      <>
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
                          Photo Albums
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {albums.map((album) => (
                            <div
                              key={album._id}
                              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer"
                              onClick={() => handleAlbumClick(album._id)}
                            >
                              <div className="relative h-64">
                                {album.coverImage ? (
                                  <img
                                    src={urlFor(album.coverImage)
                                      .width(600)
                                      .height(400)
                                      .url()}
                                    alt={album.title}
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                ) : album.firstImage ? (
                                  <img
                                    src={urlFor(album.firstImage)
                                      .width(600)
                                      .height(400)
                                      .url()}
                                    alt={album.title}
                                    className="w-full h-full object-cover rounded-t-lg"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">
                                      No image
                                    </span>
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3">
                                  <h3 className="font-bold text-lg">
                                    {album.title}
                                  </h3>
                                  <p className="text-sm">
                                    {album.imageCount || 0} photos
                                  </p>
                                </div>
                              </div>
                              {album.description && (
                                <div className="p-4">
                                  <p className="text-gray-600 line-clamp-2">
                                    {album.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <FileX size={64} className="text-gray-400 mb-4" />
                <p className="text-xl text-gray-600">
                  No {activeTab.toLowerCase()} available at the moment.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox for Gallery */}
      {lightboxOpen && (
        <Lightbox
          mainSrc={urlFor(gallery[selectedImageIndex].image).url()}
          nextSrc={urlFor(
            gallery[(selectedImageIndex + 1) % gallery.length].image
          ).url()}
          prevSrc={urlFor(
            gallery[(selectedImageIndex + gallery.length - 1) % gallery.length]
              .image
          ).url()}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setSelectedImageIndex(
              (selectedImageIndex + gallery.length - 1) % gallery.length
            )
          }
          onMoveNextRequest={() =>
            setSelectedImageIndex((selectedImageIndex + 1) % gallery.length)
          }
        />
      )}

      {/* Lightbox for Album Images */}
      {albumLightboxOpen &&
        selectedAlbum &&
        selectedAlbum.images &&
        selectedAlbum.images.length > 0 && (
          <Lightbox
            mainSrc={urlFor(
              selectedAlbum.images[selectedAlbumImageIndex]
            ).url()}
            nextSrc={
              selectedAlbum.images.length > 1
                ? urlFor(
                    selectedAlbum.images[
                      (selectedAlbumImageIndex + 1) %
                        selectedAlbum.images.length
                    ]
                  ).url()
                : undefined
            }
            prevSrc={
              selectedAlbum.images.length > 1
                ? urlFor(
                    selectedAlbum.images[
                      (selectedAlbumImageIndex +
                        selectedAlbum.images.length -
                        1) %
                        selectedAlbum.images.length
                    ]
                  ).url()
                : undefined
            }
            imageTitle={
              selectedAlbum.images[selectedAlbumImageIndex]?.caption || ""
            }
            imageCaption={
              selectedAlbum.images[selectedAlbumImageIndex]?.alt || ""
            }
            onCloseRequest={closeAlbumLightbox}
            onMovePrevRequest={() =>
              setSelectedAlbumImageIndex(
                (selectedAlbumImageIndex + selectedAlbum.images.length - 1) %
                  selectedAlbum.images.length
              )
            }
            onMoveNextRequest={() =>
              setSelectedAlbumImageIndex(
                (selectedAlbumImageIndex + 1) % selectedAlbum.images.length
              )
            }
            enableZoom={true}
          />
        )}
    </>
  );
};

// Main component
const MediaPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-80 bg-cover bg-center"
        style={{ backgroundImage: `url('/images/1media.jpg')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl text-white font-bold"
          >
            Media
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-white mt-4 max-w-xl text-center text-lg"
          >
            Explore our mission through stories, visuals, and insights that
            capture the impact of our work.
          </motion.p>
        </div>
      </motion.section>

      <Suspense fallback={<Loading />}>
        <MediaContent />
      </Suspense>
    </div>
  );
};

export default MediaPage;
