"use client";

import Image from "next/image";
import { urlFor } from "../../sanity/utils";
import { PortableText } from "@portabletext/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { components } from "../../lib/portableText";

export default function ToolContent({ tool }) {
  return (
    <section className="bg-gray-50 text-gray-700">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen max-w-4xl mx-auto md:p-12 p-5"
      >
        <Link href={"/tools"}>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-all duration-300"
          >
            Back to Tools
          </motion.button>
        </Link>
        <div className="container mx-auto px-4 bg-white p-8 rounded-lg shadow-lg">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl font-bold text-green-700 mb-6"
          >
            {tool.name}
          </motion.h1>

          <div className="mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <Image
                src={tool.image ? urlFor(tool.image).url() : "/images/default-tool.jpg"}
                alt={tool.name}
                width={1200}
                height={600}
                className="rounded-xl shadow-lg h-96 w-full object-cover object-center"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="prose prose-lg max-w-none text-gray-700"
          >
            <PortableText value={tool.briefDescription} components={components} />
          </motion.div>

          <div className="mt-10 text-center">
            <a
              href={tool.buttonUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {tool.buttonText || "View Tool"}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
