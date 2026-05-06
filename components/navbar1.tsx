"use client"

import { LogOut, Menu, Search, UserCircle } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/app/_components/DarkMode/DarkMode"
import { useContext, useState } from "react"
import { User } from "@/contexts/UserContext"

interface MenuItem {
  title: string
  url: string
  description?: string
  icon?: React.ReactNode
  items?: MenuItem[]
}

interface Navbar1Props {
  className?: string
  logo?: {
    url: string
    src: string
    darkSrc?: string
    alt: string
    title: string
    className?: string
  }
  menu?: MenuItem[]
  auth?: {
    login: {
      title: string
      url: string
    }
    signup: {
      title: string
      url: string
    }
  }
}

const Navbar1 = ({
  logo = {
    url: "/",
    src: "/icons/book-light.svg",
    darkSrc: "/icons/book-dark.svg",
    alt: "Alex Library Logo",
    title: "Alex Library",
  },
  menu = [
    { title: "Home", url: "/" },
    {
      title: "Books",
      url: "/books",
    },
    { title: "About", url: "/about" },
  ],
  auth = {
    login: { title: "Login", url: "/login" },
    signup: { title: "Sign up", url: "/signup" },
  },
  className,
}: Navbar1Props) => {
  const router = useRouter()
  const userContext = useContext(User)
  const isLoggedIn = !!userContext?.userToken
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleSignOut = () => {
    userContext?.setUserToken(null)
    userContext?.setUserData(null)
    userContext?.setUserRole(null)
    router.push("/")
  }

  const handleMenuClick = () => {
    setIsSheetOpen(false)
  }

  return (
    <section
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b bg-background/95 py-4 backdrop-blur-sm",
        className
      )}
    >
      <div className="container">
        {/* Desktop Menu */}
        <nav className="hidden items-center justify-between lg:flex">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.darkSrc || logo.src}
                className="hidden max-h-8 dark:block"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <Image
                src={logo.src}
                className="max-h-8 dark:hidden"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <span className="text-lg font-semibold tracking-tighter">
                {logo.title}
              </span>
            </Link>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="h-9 w-44 pl-9 text-sm"
              />
            </div>
            <ModeToggle />
            {isLoggedIn ? (
              <>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Link href="/profile">
                      <Button variant="outline" size="sm">
                        <UserCircle className="mr-2 size-4" />
                        Profile
                      </Button>
                    </Link>
                  </HoverCardTrigger>
                  <HoverCardContent align="end" className="w-72">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                          <UserCircle className="size-6 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm leading-none font-semibold">
                            {(userContext?.userData?.name as string) ?? "User"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(userContext?.userData?.email as string) ?? ""}
                          </p>
                        </div>
                      </div>
                      <div className="h-px bg-muted" />
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                          {(userContext?.userRole as string) ?? "member"}
                        </span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  <Link href={auth.login.url}>{auth.login.title}</Link>
                </Button>
                <Button size="sm">
                  <Link href={auth.signup.url}>{auth.signup.title}</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={logo.url} className="flex items-center gap-2">
              <Image
                src={logo.darkSrc || logo.src}
                className="hidden max-h-8 dark:block"
                alt={logo.alt}
                width={32}
                height={32}
              />
              <Image
                src={logo.src}
                className="max-h-8 dark:hidden"
                alt={logo.alt}
                width={32}
                height={32}
              />
            </Link>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>
                    <Link
                      href={logo.url}
                      className="flex items-center gap-2"
                      onClick={handleMenuClick}
                    >
                      <Image
                        src={logo.src}
                        className="max-h-8 dark:invert"
                        alt={logo.alt}
                        width={32}
                        height={32}
                      />
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 p-4">
                  <Accordion
                    type="single"
                    collapsible
                    className="flex w-full flex-col gap-4"
                  >
                    {menu.map((item) =>
                      renderMobileMenuItem(item, handleMenuClick)
                    )}
                  </Accordion>

                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        className="h-9 pl-9 text-sm"
                      />
                    </div>
                    <ModeToggle />
                    {isLoggedIn ? (
                      <>
                        <Button asChild variant="outline">
                          <Link href="/profile" onClick={handleMenuClick}>
                            <UserCircle className="mr-2 size-4" />
                            Profile
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleSignOut}
                          className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <LogOut className="mr-2 size-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button asChild variant="outline">
                          <Link href={auth.login.url}>{auth.login.title}</Link>
                        </Button>
                        <Button asChild>
                          <Link href={auth.signup.url}>
                            {auth.signup.title}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </section>
  )
}

const renderMenuItem = (item: MenuItem) => {
  const pathname = usePathname()
  const isActive = pathname === item.url

  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={isActive ? "text-purple-600 dark:text-purple-400" : ""}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-popover text-popover-foreground">
          {item.items.map((subItem) => (
            <NavigationMenuLink asChild key={subItem.title} className="w-80">
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    )
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink asChild>
        <Link
          href={item.url}
          className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 dark:hover:text-purple-300 ${
            isActive
              ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
              : ""
          }`}
        >
          {item.title}
        </Link>
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const renderMobileMenuItem = (item: MenuItem, handleMenuClick: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              handleMenuClick={handleMenuClick}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    )
  }

  return (
    <Link
      key={item.title}
      href={item.url}
      className="text-md font-semibold"
      onClick={handleMenuClick}
    >
      {item.title}
    </Link>
  )
}

const SubMenuLink = ({
  item,
  handleMenuClick,
}: {
  item: MenuItem
  handleMenuClick?: () => void
}) => {
  const pathname = usePathname()
  const isActive = pathname === item.url

  return (
    <Link
      className={`flex min-w-80 flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900 dark:hover:text-purple-300 ${
        isActive
          ? "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400"
          : ""
      }`}
      href={item.url}
      onClick={handleMenuClick}
    >
      <div className="text-foreground">{item.icon}</div>
      <div>
        <div className="text-sm font-semibold">{item.title}</div>
        {item.description && (
          <p className="text-sm leading-snug text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </Link>
  )
}

export { Navbar1 }
