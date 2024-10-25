import {
  Sun,
  Moon,
  Twitter,
  Github,
  Loader2,
  ChevronsRight,
  ChevronsLeft,
  Home,
  CreditCard,
  Shield,
  Users,
  User,
  LogOut,
  Network,
  TestTube,
  Link,
  Loader,
  Copy
} from "lucide-react"

export const Icons = {
  sun: Sun,
  moon: Moon,
  twitter: Twitter,
  gitHub: Github,
  spinner: Loader2,
  chevronsRight: ChevronsRight,
  chevronsLeft: ChevronsLeft,
  home: Home,
  creditCard: CreditCard,
  shield: Shield,
  users: Users,
  user: User,
  logOut: LogOut,
  network: Network,
  testTube: TestTube,
  link: Link,
  loader: Loader,
  copy: Copy,
}

export type Icon = keyof typeof Icons