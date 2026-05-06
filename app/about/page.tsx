import React from "react"
import { About3 } from "@/components/about3"

export default function page() {
  return (
    <About3
      title="About Alex Library"
      description="Welcome to Alex Library, your gateway to knowledge and learning. We are dedicated to providing access to a vast collection of books, digital resources, and educational materials that inspire curiosity and foster intellectual growth in our community."
      mainImage={{
        src: "https://www.egypttoursportal.com/images/2017/11/Alexandria-Library-Egypt-Tours-Portal.jpg",
        alt: "Alex Library Interior",
      }}
      secondaryImage={{
        src: "https://images.pexels.com/photos/15238618/pexels-photo-15238618.jpeg",
        alt: "Students Reading",
      }}
      breakout={{
        src: "/icons/book-light.svg",
        alt: "Alex Library Logo",
        title: "Your Gateway to Knowledge",
        description:
          "Providing our community with access to quality books, digital resources, and educational programs that enrich lives and expand horizons.",
        buttonText: "Explore Collection",
        buttonUrl: "/books",
      }}
      companies={null}
      achievementsTitle="Our Library in Numbers"
      achievementsDescription="Serving our community with excellence and dedication to education and knowledge sharing."
      achievements={[
        { label: "Books Available", value: "50,000+" },
        { label: "Active Members", value: "10,000+" },
        { label: "Daily Visitors", value: "500+" },
        { label: "Years of Service", value: "25+" },
      ]}
      contentSections={[
        {
          title: "Our Mission",
          content:
            "At Alex Library, our mission is to provide free and equal access to information, ideas, and knowledge that enrich our community's cultural, educational, and personal growth. We strive to create a welcoming environment where everyone can discover, learn, and explore.\n\nWe believe in the power of books and knowledge to transform lives, build communities, and create opportunities for personal and professional development.",
        },
        {
          title: "Our Services",
          content:
            "Alex Library offers a comprehensive range of services designed to meet the diverse needs of our community. From traditional book lending to digital resources, educational programs, and community events, we provide the tools and support needed for lifelong learning.\n\nOur dedicated staff is committed to helping you find the information you need, develop new skills, and connect with others who share your interests and passions.",
        },
      ]}
    />
  )
}
