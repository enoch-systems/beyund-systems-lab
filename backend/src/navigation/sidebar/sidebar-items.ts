import {
  Award,
  Banknote,
  Bell,
  GraduationCap,
  type LucideIcon,
  Mail,
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
];
