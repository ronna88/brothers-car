"use client"
import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import {
  Car,
  CircleUser,
  DollarSign,
  HandCoins,
  HomeIcon,
  MenuIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { useState } from "react"

const Header = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const handleButtonClick = () => {
    setIsSheetOpen(false)
  }

  return (
    <Card>
      <CardContent className="flex flex-row items-center justify-between p-5">
        <Image src="/logo.png" alt="Brother's Car" width={100} height={15} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsSheetOpen(true)}
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="text-left">Menu</SheetTitle>

            <div className="flex items-center border-b border-solid py-5">
              <Avatar>
                <AvatarImage src="https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              </Avatar>

              <div className="ml-3 flex flex-col">
                <span className="font-semibold">Theo</span>
                <span className="text-xs text-gray-500">
                  theo@suxberger.com.br
                </span>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString("pt-BR", options)}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-b border-solid py-5">
              <Button
                className="justify-start"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <Link href="/" className="flex flex-row gap-2">
                  <HomeIcon size={18}></HomeIcon>
                  Início
                </Link>
              </Button>
              <Button
                className="justify-start"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <Link href="/clientes" className="flex flex-row gap-2">
                  <CircleUser size={18} />
                  Clientes
                </Link>
              </Button>
              <Button
                className="justify-start gap-2"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <Link href="/carros" className="flex flex-row gap-2">
                  <Car size={18} /> Carros
                </Link>
              </Button>
              <Button
                className="justify-start gap-2"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <Link href="/orcamentos" className="flex flex-row gap-2">
                  <DollarSign size={18} />
                  Orçamentos
                </Link>
              </Button>
              <Button
                className="justify-start gap-2"
                variant="ghost"
                onClick={handleButtonClick}
              >
                <Link href="/financeiro" className="flex flex-row gap-2">
                  <HandCoins size={18} /> Financeiro
                </Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
