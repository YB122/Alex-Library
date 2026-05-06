"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { LucideIcon } from "lucide-react"
import { Clock, MapPin, Phone } from "lucide-react"
import { Fragment } from "react"
import Link from "next/link"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type NewsletterData = {
  title?: string
  description?: string
}

type NewsletterFormProps = NewsletterData

type FooterLink = {
  text: string
  link: string
}

type FooterLinksSectionData = {
  title: string
  items: FooterLink[]
}

interface FooterLinksSectionProps {
  sections: FooterLinksSectionData[]
}

type SocialIcon = {
  title: string
  src: string
  className?: string
}

type SocialLink = {
  link: string
  icon: SocialIcon
}

type ContactLink = {
  icon: LucideIcon
  text: string
  type: LinkTypes
  link?: string
}

type ContactLinks = {
  contactDetails: ContactLink[]
  socialMedia: SocialLink[]
}

interface ContactSectionProps {
  links: ContactLinks
}

interface EcommerceFooter1Props {
  newsletter: NewsletterData
  footerLinks: FooterLinksSectionData[]
  contactLinks: ContactLinks
  className?: string
}

const LINK_TYPES = {
  NO_LINK: "NO_LINK",
  PHONE_LINK: "PHONE_LINK",
  EMAIL_LINK: "EMAIL_LINK",
}

type LinkTypes = keyof typeof LINK_TYPES

const NEWSLETTER_DATA = {
  title: "Library Updates",
  description:
    "Stay updated with new book arrivals, reading recommendations, library events, and exclusive member benefits.",
}

const FOOTER_LINKS: FooterLinksSectionData[] = [
  {
    title: "Library",
    items: [
      {
        text: "About Us",
        link: "/about",
      },
      {
        text: "Our Collection",
        link: "/books",
      },
      {
        text: "Membership",
        link: "#",
      },
      {
        text: "Library Hours",
        link: "#",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        text: "Book Borrowing",
        link: "/books",
      },
      {
        text: "New Arrivals",
        link: "#",
      },
      {
        text: "Reading Rooms",
        link: "#",
      },
      {
        text: "Events & Programs",
        link: "#",
      },
    ],
  },
]

const SOCIAL_ICONS = {
  linkedin: {
    title: "LinkedIn",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/linkedin-icon.svg",
  },
  github: {
    title: "GitHub",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg",
    className: "dark:invert",
  },
  portfolio: {
    title: "Portfolio",
    src: "https://youssef-portfolio-chi.vercel.app/youssef.svg",
  },
}

const CONTACT_LINKS: ContactLinks = {
  contactDetails: [
    {
      icon: MapPin,
      text: "123 Library Street, Alexandria, Egypt",
      link: "https://maps.google.com",
      type: LINK_TYPES.NO_LINK as LinkTypes,
    },
    {
      icon: Phone,
      text: "+20 1 2845 84675",
      link: "+201284584675",
      type: LINK_TYPES.PHONE_LINK as LinkTypes,
    },
    {
      icon: Clock,
      text: "Sunday - Thursday, 8 AM - 8 PM",
      type: LINK_TYPES.NO_LINK as LinkTypes,
    },
  ],
  socialMedia: [
    {
      icon: SOCIAL_ICONS.linkedin,
      link: "https://www.linkedin.com/in/youssef-benyamine-b55a81219/",
    },
    {
      icon: SOCIAL_ICONS.github,
      link: "https://github.com/YB122",
    },
    {
      icon: SOCIAL_ICONS.portfolio,
      link: "https://youssef-portfolio-chi.vercel.app/",
    },
  ],
}

const Footer = ({
  newsletter = NEWSLETTER_DATA,
  footerLinks = FOOTER_LINKS,
  contactLinks = CONTACT_LINKS,
  className,
}: EcommerceFooter1Props) => {
  return (
    <section className={cn("pt-8 pb-8 xl:pt-12", className)}>
      <div className="container space-y-10">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <NewsletterSection {...newsletter} />
          </div>
          <FooterLinksSection sections={footerLinks} />
          <ContactSection links={contactLinks} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-4 md:gap-12.5">
            <Separator className="flex-1" />
            <div className="basis-10 md:basis-10">
              <Link href="/">
                <img
                  className="block size-10 dark:hidden"
                  src="/icons/book-light.svg"
                  alt="Alex Library Logo"
                />
                <img
                  className="hidden size-10 dark:block"
                  src="/icons/book-dark.svg"
                  alt="Alex Library Logo"
                />
              </Link>
            </div>
            <Separator className="flex-1" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted-foreground max-md:text-xs">
            Copyright 2026 Alex Library
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="sr-only">X (Twitter)</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06zm1.493 4.493l3.01 1.492-1.493 1.493-1.493-1.493 1.492-1.492zm-1.493 2.117l2.117 2.117-1.493 1.493-2.117-2.117 1.493-1.493zm-1.493 1.493l-2.117 2.117-1.493-1.493 2.117-2.117 1.493 1.493zm-1.493 1.493l-3.01 1.492 1.492 1.493 1.493-1.493-1.493-1.492zm6.055 5.018l-2.117-2.117 1.493-1.493 2.117 2.117-1.493 1.493zm-2.117 1.493l-1.493 1.493-2.117-2.117 1.493-1.493 2.117 2.117zm1.493 1.493l1.493 1.493-2.117 2.117-1.493-1.493 2.117-2.117z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const newsletterFormSchema = z.object({
  email: z.string().email(),
})

type newsletterFormType = z.infer<typeof newsletterFormSchema>

const NewsletterSection = ({ title, description }: NewsletterFormProps) => {
  const form = useForm({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: newsletterFormType) => {
    // Simulate newsletter subscription
    toast.success("Successfully subscribed to newsletter!")
    form.reset()

    // In a real application, you would make an API call here:
    // try {
    //   const response = await fetch('/api/newsletter', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email: data.email })
    //   })
    //   if (response.ok) {
    //     toast.success("Successfully subscribed to newsletter!")
    //     form.reset()
    //   } else {
    //     toast.error("Failed to subscribe. Please try again.")
    //   }
    // } catch (error) {
    //   toast.error("An error occurred. Please try again.")
    // }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-serif text-3xl leading-none font-medium">
          {title}
        </h3>
        <p className="leading-normal font-light">{description}</p>
      </div>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Email Address"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full">Subscribe</Button>
      </form>
    </div>
  )
}

const FooterLinksSection = ({ sections }: FooterLinksSectionProps) => {
  return (
    <Fragment>
      {sections.map(({ title, items }) => (
        <div key={crypto.randomUUID()}>
          <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">
            {title}
          </h2>
          <ul className="space-y-3">
            {items.map(({ text, link }) => (
              <li key={crypto.randomUUID()}>
                <Link
                  href={link}
                  className="underline-offset-4 hover:underline"
                >
                  {text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Fragment>
  )
}

const ContactSection = ({ links }: ContactSectionProps) => {
  const { socialMedia, contactDetails } = links

  return (
    <div>
      <h2 className="mb-6 text-sm leading-tight font-medium text-muted-foreground uppercase">
        Contact
      </h2>
      <div className="space-y-6">
        <ul className="space-y-3">
          {contactDetails.map((item) => (
            <li className="flex items-center gap-3" key={crypto.randomUUID()}>
              <item.icon className="size-4 shrink-0 basis-4" />
              <div className="flex-1">
                {item.type === LINK_TYPES.NO_LINK ? (
                  <p>{item.text}</p>
                ) : (
                  <a
                    href={
                      LINK_TYPES.EMAIL_LINK
                        ? `mailto:${item.link}`
                        : `tel:${item.link}`
                    }
                    className="underline-offset-4 hover:underline"
                  >
                    {item.text}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-3">
          {socialMedia.map(({ icon, link }) => (
            <li key={crypto.randomUUID()}>
              <Button size="icon-lg" variant="outline" asChild>
                <a href={link}>
                  <img
                    className={cn("size-5", icon.className)}
                    alt={icon.title}
                    src={icon.src}
                  />
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export { NEWSLETTER_DATA, FOOTER_LINKS, CONTACT_LINKS }
export default Footer
