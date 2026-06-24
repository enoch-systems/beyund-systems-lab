import {
  Award,
  Banknote,
  Bell,
  Fingerprint,
  GraduationCap,
  type LucideIcon,
  Mail,
  SquareArrowUpRight,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Management",
    items: [
      {
        title: "Students",
        url: "/dashboard/students",
        icon: Users,
      },
      {
        title: "Courses",
        url: "/dashboard/courses",
        icon: GraduationCap,
      },
      {
        title: "Payments",
        url: "/dashboard/payments",
        icon: Banknote,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Certificates",
        url: "/dashboard/certificates",
        icon: Award,
      },
      {
        title: "Email History",
        url: "/dashboard/email-history",
        icon: Mail,
      },
    ],
  },
  {
    id: 3,
    label: "Pages",
    items: [
      {
        title: "Email",
        url: "/dashboard/mail",
        icon: Mail,
      },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
];
