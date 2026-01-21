'use client';

import { getTools, urlFor } from "../sanity/utils";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const truncatePortableText = (value, wordLimit) => {
    if (!value) return [];
    let wordCount = 0;
    const newBlocks = [];

    for (const block of value) {
      if (wordCount >= wordLimit) break;
      if (block._type !== 'block' || !block.children) {
        newBlocks.push(block);
        continue;
      }

      const newChildren = [];
      for (const span of block.children) {
        if (wordCount >= wordLimit) break;
        const words = span.text.split(/\s+/);
        const remainingWords = wordLimit - wordCount;

        if (words.length <= remainingWords) {
          newChildren.push(span);
          wordCount += words.length;
        } else {
          const truncatedText = words.slice(0, remainingWords).join(' ');
          newChildren.push({ ...span, text: `${truncatedText}...` });
          wordCount = wordLimit;
        }
      }
      if (newChildren.length > 0) {
        newBlocks.push({ ...block, children: newChildren });
      }
    }
    return newBlocks;
  };

  const fetchTools = async () => {
    try {
      const fetchedTools = await getTools();
      setTools(fetchedTools);
    } catch (err) {
      setError("Failed to load tools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
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
            Our Tools
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-white mt-4 max-w-xl text-center text-lg"
          >
            Discover resources and tools designed to support our mission and empower communities.
          </motion.p>
        </div>
      </motion.section>

      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <motion.div
              key={tool._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={tool.image ? urlFor(tool.image).url() : "/images/default-tool.jpg"} // Add a default image at this path
                  alt={tool.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-green-700 mb-2">{tool.name}</h3>
                <div className="text-gray-600 mb-4 prose prose-sm">
                  <PortableText value={truncatePortableText(tool.briefDescription, 50)} />
                </div>
                <div className="mt-auto">
                  {/* <Link
                    href={`/tools/${tool.slug.current}`}
                    className="inline-block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                  >
                    View Tool
                  </Link> */}
                  <a
                    href={tool.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                  >
                    {tool.buttonText || "View Tool"}
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
